    // main.c for ESP-IDF framework
    #include <stdio.h>
    #include <string.h>
    #include <stdbool.h>
    #include "driver/gpio.h"
    #include "driver/spi_master.h"
    #include "esp_log.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "soc/gpio_struct.h"
    #include "esp_timer.h"
    #include "esp_wifi.h"
    #include "esp_event.h"
    #include "nvs_flash.h"
    #include "esp_http_client.h"
    #include "esp_netif.h"

    // Wifi/API variables
    #define WIFI_SSID "Hamburger"
    #define WIFI_PASS "minediamonds"
    #define BACKEND_URL "http://192.168.250.242:3000/api/druppel/init-keyfob"

    // Pin definitions
    #define PIN_NUM_MISO 19
    #define PIN_NUM_MOSI 23
    #define PIN_NUM_CLK  18
    #define PIN_NUM_CS   21
    #define PIN_NUM_RST  22

    // RC522 Commands
    #define PCD_IDLE              0x00
    #define PCD_AUTHENT           0x0E
    #define PCD_RECEIVE           0x08
    #define PCD_TRANSMIT          0x04
    #define PCD_TRANSCEIVE        0x0C
    #define PCD_RESETPHASE        0x0F
    #define PCD_CALCCRC           0x03

    // RC522 Registers
    #define CommandReg            0x01
    #define ComIEnReg             0x02
    #define DivIEnReg             0x03
    #define ComIrqReg             0x04
    #define DivIrqReg             0x05
    #define ErrorReg              0x06
    #define Status1Reg            0x07
    #define Status2Reg            0x08
    #define FIFODataReg           0x09
    #define FIFOLevelReg          0x0A
    #define WaterLevelReg         0x0B
    #define ControlReg            0x0C
    #define BitFramingReg         0x0D
    #define CollReg               0x0E
    #define ModeReg               0x11
    #define TxModeReg             0x12
    #define RxModeReg             0x13
    #define TxControlReg          0x14
    #define TxASKReg              0x15
    #define TxSelReg              0x16
    #define RxSelReg              0x17
    #define RxThresholdReg        0x18
    #define DemodReg              0x19
    #define MfTxReg               0x1C
    #define MfRxReg               0x1D
    #define SerialSpeedReg        0x1F
    #define CRCResultRegH         0x21
    #define CRCResultRegL         0x22
    #define ModWidthReg           0x24
    #define RFCfgReg              0x26
    #define GsNReg                0x27
    #define CWGsPReg              0x28
    #define ModGsPReg             0x29
    #define TModeReg              0x2A
    #define TPrescalerReg         0x2B
    #define TReloadRegH           0x2C
    #define TReloadRegL           0x2D
    #define TCounterValueRegH     0x2E
    #define TCounterValueRegL     0x2F
    #define TestSel1Reg           0x31
    #define TestSel2Reg           0x32
    #define TestPinEnReg          0x33
    #define TestPinValueReg       0x34
    #define TestBusReg            0x35
    #define AutoTestReg           0x36
    #define VersionReg            0x37
    #define AnalogTestReg         0x38
    #define TestDAC1Reg           0x39
    #define TestDAC2Reg           0x3A
    #define TestADCReg            0x3B

    static const char *TAG = "RC522";
    static spi_device_handle_t spi;

    // Global variables for UID tracking
    static char last_uid[20] = {0};

    // WiFi event handler
    static void wifi_event_handler(void* arg, esp_event_base_t event_base, 
                                int32_t event_id, void* event_data) {
        if (event_base == WIFI_EVENT) {
            if (event_id == WIFI_EVENT_STA_START) {
                printf("[WiFi] Station started\n");
                esp_wifi_connect();
            } else if (event_id == WIFI_EVENT_STA_CONNECTED) {
                printf("[WiFi] Connected to AP\n");
            } else if (event_id == WIFI_EVENT_STA_DISCONNECTED) {
                printf("[WiFi] Disconnected from AP\n");
                // Try to reconnect after a delay
                vTaskDelay(pdMS_TO_TICKS(2000));
                esp_wifi_connect();
            }
        } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
            ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;
            printf("[WiFi] Got IP: " IPSTR "\n", IP2STR(&event->ip_info.ip));
        }
    }

    // Test GPIO pins
    void test_gpio_pins(void) {
        printf("\n=== Testing GPIO Pins ===\n");
        
        // Test RST pin
        gpio_reset_pin(PIN_NUM_RST);
        gpio_set_direction(PIN_NUM_RST, GPIO_MODE_OUTPUT);
        gpio_set_level(PIN_NUM_RST, 0);
        printf("RST pin set to LOW\n");
        vTaskDelay(pdMS_TO_TICKS(100));
        gpio_set_level(PIN_NUM_RST, 1);
        printf("RST pin set to HIGH\n");
        
        // Test CS pin
        gpio_reset_pin(PIN_NUM_CS);
        gpio_set_direction(PIN_NUM_CS, GPIO_MODE_OUTPUT);
        gpio_set_level(PIN_NUM_CS, 0);
        printf("CS pin set to LOW (active)\n");
        vTaskDelay(pdMS_TO_TICKS(100));
        gpio_set_level(PIN_NUM_CS, 1);
        printf("CS pin set to HIGH (inactive)\n");
        
        printf("=== GPIO Test Complete ===\n\n");
    }

    // Hard reset RC522
    void rc522_hard_reset(void) {
        printf("Performing hard reset...\n");
        
        gpio_reset_pin(PIN_NUM_RST);
        gpio_set_direction(PIN_NUM_RST, GPIO_MODE_OUTPUT);
        
        // Reset sequence
        gpio_set_level(PIN_NUM_RST, 0);
        vTaskDelay(pdMS_TO_TICKS(100));
        gpio_set_level(PIN_NUM_RST, 1);
        vTaskDelay(pdMS_TO_TICKS(50));
        
        printf("Hard reset completed\n");
    }

    // Write a byte to the specified register
    esp_err_t rc522_write(uint8_t reg, uint8_t value) {
        uint8_t tx_data[2] = {(reg << 1) & 0x7E, value};
        
        spi_transaction_t t = {
            .length = 16,
            .tx_buffer = tx_data,
            .rx_buffer = NULL,
            .flags = 0,
        };
        
        return spi_device_transmit(spi, &t);
    }

    // Read a byte from the specified register
    uint8_t rc522_read(uint8_t reg) {
        uint8_t tx_data[2] = {((reg << 1) & 0x7E) | 0x80, 0x00};
        uint8_t rx_data[2] = {0, 0};
        
        spi_transaction_t t = {
            .length = 16,
            .tx_buffer = tx_data,
            .rx_buffer = rx_data,
            .flags = 0,
        };
        
        esp_err_t ret = spi_device_transmit(spi, &t);
        if (ret != ESP_OK) {
            printf("SPI read error for reg 0x%02X: %s\n", reg, esp_err_to_name(ret));
            return 0xFF;
        }
        
        return rx_data[1];
    }

    // Test SPI communication
    bool test_spi_communication(void) {
        printf("\n=== Testing SPI Communication ===\n");
        
        // Test 1: Write to version register (should always respond)
        printf("Test 1: Reading Version Register...\n");
        uint8_t version = rc522_read(VersionReg);
        printf("Version register (0x37): 0x%02X\n", version);
        
        // Test 2: Write and read back from a test register
        printf("\nTest 2: Write/Read test...\n");
        rc522_write(TModeReg, 0x8D);
        vTaskDelay(pdMS_TO_TICKS(10));
        uint8_t readback = rc522_read(TModeReg);
        printf("Wrote 0x8D to TModeReg, read back 0x%02X\n", readback);
        
        if (readback == 0x8D) {
            printf("✓ SPI communication working!\n");
            return true;
        } else {
            printf("✗ SPI communication failed!\n");
            return false;
        }
    }

    // Initialize RC522
    bool rc522_init(void) {
        printf("\n=== Initializing RC522 ===\n");
        
        // Perform hard reset
        rc522_hard_reset();
        
        // Initialize SPI bus
        spi_bus_config_t buscfg = {
            .miso_io_num = PIN_NUM_MISO,
            .mosi_io_num = PIN_NUM_MOSI,
            .sclk_io_num = PIN_NUM_CLK,
            .quadwp_io_num = -1,
            .quadhd_io_num = -1,
            .max_transfer_sz = 32,
            .flags = 0,
        };
        
        spi_device_interface_config_t devcfg = {
            .clock_speed_hz = 500000,      // Start with 500 kHz
            .mode = 0,                     // SPI Mode 0
            .spics_io_num = PIN_NUM_CS,
            .queue_size = 7,
            .flags = 0,
        };
        
        // Initialize SPI
        esp_err_t ret = spi_bus_initialize(SPI2_HOST, &buscfg, 0);
        if (ret != ESP_OK) {
            printf("SPI bus init failed: %s\n", esp_err_to_name(ret));
            return false;
        }
        
        ret = spi_bus_add_device(SPI2_HOST, &devcfg, &spi);
        if (ret != ESP_OK) {
            printf("SPI device add failed: %s\n", esp_err_to_name(ret));
            return false;
        }
        
        printf("SPI initialized successfully\n");
        
        // Test SPI communication first
        if (!test_spi_communication()) {
            printf("SPI communication test failed!\n");
            return false;
        }
        
        // Now try to initialize RC522
        printf("\nConfiguring RC522 registers...\n");
        
        // Soft reset
        rc522_write(CommandReg, PCD_RESETPHASE);
        vTaskDelay(pdMS_TO_TICKS(50));
        
        // Check if chip is responding
        uint8_t version = rc522_read(VersionReg);
        printf("RC522 Version: 0x%02X\n", version);
        
        if (version == 0x00 || version == 0xFF) {
            printf("ERROR: RC522 not responding!\n");
            printf("Check:\n");
            printf("1. Wiring (MISO, MOSI, CLK, CS, RST, 3.3V, GND)\n");
            printf("2. Power supply (RC522 needs 3.3V, not 5V!)\n");
            printf("3. CS pin is connected and pulled high correctly\n");
            return false;
        }
        
        // Configure RC522
        rc522_write(TModeReg, 0x8D);
        rc522_write(TPrescalerReg, 0x3E);
        rc522_write(TReloadRegL, 30);
        rc522_write(TReloadRegH, 0x00);
        rc522_write(TxASKReg, 0x40);
        rc522_write(ModeReg, 0x3D);
        
        // Enable antenna
        uint8_t tx_control = rc522_read(TxControlReg);
        rc522_write(TxControlReg, tx_control | 0x03);
        
        printf("RC522 initialized successfully!\n");
        return true;
    }

    // Simple card detection (for testing)
    bool rc522_is_card_present(void) {
        // Clear interrupts
        rc522_write(ComIrqReg, 0x7F);
        
        // Send REQA command
        rc522_write(BitFramingReg, 0x07);
        rc522_write(FIFODataReg, 0x26);
        rc522_write(CommandReg, PCD_TRANSCEIVE);
        rc522_write(BitFramingReg, 0x87);
        
        // Wait a bit
        vTaskDelay(pdMS_TO_TICKS(25));
        
        // Check if data received
        uint8_t com_irq = rc522_read(ComIrqReg);
        rc522_write(CommandReg, PCD_IDLE);
        
        return (com_irq & 0x20) != 0;
    }

    // Read UID (simplified for testing)
    bool rc522_read_uid(uint8_t *uid_out) {
        uint8_t irq;
        uint8_t fifo_level;

        // Clear IRQs and FIFO
        rc522_write(ComIrqReg, 0x7F);
        rc522_write(FIFOLevelReg, 0x80);

        // ANTICOLLISION CL1
        rc522_write(BitFramingReg, 0x00);
        rc522_write(FIFODataReg, 0x93);
        rc522_write(FIFODataReg, 0x20);

        rc522_write(CommandReg, PCD_TRANSCEIVE);
        rc522_write(BitFramingReg, 0x80);

        // Wait for RX or timeout
        for (int i = 0; i < 100; i++) {
            irq = rc522_read(ComIrqReg);
            if (irq & 0x20) break; // RxIRq
            if (irq & 0x01) return false; // Timer
            vTaskDelay(pdMS_TO_TICKS(1));
        }

        rc522_write(CommandReg, PCD_IDLE);

        // Error check
        if (rc522_read(ErrorReg) & 0x13) {
            return false;
        }

        fifo_level = rc522_read(FIFOLevelReg);
        if (fifo_level < 5) {
            return false;
        }

        // Read UID (4 bytes)
        uint8_t bcc = 0;
        for (int i = 0; i < 4; i++) {
            uid_out[i] = rc522_read(FIFODataReg);
            bcc ^= uid_out[i];
        }

        uint8_t received_bcc = rc522_read(FIFODataReg);
        if (bcc != received_bcc) {
            return false;
        }

        return true;
    }

    // Function to send HTTP POST request to backend
    void send_scan_to_backend(const char* uid_hex) {
        printf("[HTTP] Preparing to send UID: %s\n", uid_hex);
        
        esp_http_client_config_t config = {
            .url = BACKEND_URL,
            .method = HTTP_METHOD_PUT,
            .timeout_ms = 5000,
        };
        
        esp_http_client_handle_t client = esp_http_client_init(&config);
        
        if (!client) {
            printf("[HTTP] Failed to initialize HTTP client\n");
            return;
        }
        
        // Set content type header
        esp_http_client_set_header(client, "Content-Type", "application/json");
        
        // Create JSON payload
        char payload[200];
        int64_t timestamp = esp_timer_get_time() / 1000; // Convert to milliseconds
        snprintf(payload, sizeof(payload), 
        "{\"keyfob_key\":\"%s\",\"device\":\"esp32-rfid-reader\",\"timestamp\":%lld}", uid_hex, timestamp);
        
        printf("[HTTP] Sending payload: %s\n", payload);
        
        // Set POST data
        esp_http_client_set_post_field(client, payload, strlen(payload));
        
        // Execute request
        esp_err_t err = esp_http_client_perform(client);
        
        if (err == ESP_OK) {
            int status_code = esp_http_client_get_status_code(client);
            if (status_code == 200 || status_code == 201) {
                printf("[HTTP] POST successful (Status: %d)\n", status_code);
            } else {
                printf("[HTTP] POST failed (Status: %d)\n", status_code);
                // Print response body if available
                int content_len = esp_http_client_get_content_length(client);
                if (content_len > 0) {
                    char *buffer = malloc(content_len + 1);
                    if (buffer) {
                        esp_http_client_read(client, buffer, content_len);
                        buffer[content_len] = '\0';
                        printf("[HTTP] Response: %s\n", buffer);
                        free(buffer);
                    }
                }
            }
        } else {
            printf("[HTTP] Request failed: %s\n", esp_err_to_name(err));
        }
        
        esp_http_client_cleanup(client);
    }

    // Function to initialize WiFi
    static void wifi_init_sta(void) {
        // Initialize NVS
        esp_err_t ret = nvs_flash_init();
        if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
            ESP_ERROR_CHECK(nvs_flash_erase());
            ret = nvs_flash_init();
        }
        ESP_ERROR_CHECK(ret);
        
        // Initialize TCP/IP stack
        ESP_ERROR_CHECK(esp_netif_init());
        
        // Create default event loop
        ESP_ERROR_CHECK(esp_event_loop_create_default());
        
        // Create default WiFi station
        esp_netif_t *sta_netif = esp_netif_create_default_wifi_sta();
        assert(sta_netif);
        
        // Initialize WiFi with default config
        wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
        ESP_ERROR_CHECK(esp_wifi_init(&cfg));
        
        // Register event handlers
        ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT,
                                                            ESP_EVENT_ANY_ID,
                                                            &wifi_event_handler,
                                                            NULL,
                                                            NULL));
        ESP_ERROR_CHECK(esp_event_handler_instance_register(IP_EVENT,
                                                            IP_EVENT_STA_GOT_IP,
                                                            &wifi_event_handler,
                                                            NULL,
                                                            NULL));
        
        // Configure WiFi station
        wifi_config_t wifi_config = {
            .sta = {
                .ssid = WIFI_SSID,
                .password = WIFI_PASS,
                .threshold.authmode = WIFI_AUTH_WPA2_PSK,
                .pmf_cfg = {
                    .capable = true,
                    .required = false
                },
            },
        };
        
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_start());
        
        printf("[WiFi] WiFi initialization complete. Connecting to %s...\n", WIFI_SSID);
    }

    void app_main(void) {
        printf("\n\n");
        printf("========================================\n");
        printf("       ESP32 RFID Reader with WiFi\n");
        printf("========================================\n\n");
        
        // Initialize WiFi first
        printf("[WiFi] Initializing WiFi...\n");
        wifi_init_sta();
        
        // Wait for WiFi connection
        printf("[WiFi] Waiting for connection...\n");
        for (int i = 0; i < 20; i++) {
            printf(".");
            vTaskDelay(pdMS_TO_TICKS(500));
        }
        printf("\n");
        
        // Test GPIO pins
        test_gpio_pins();
        
        // Try to initialize RC522
        if (!rc522_init()) {
            printf("\n========================================\n");
            printf("FAILED: RC522 initialization failed!\n");
            printf("========================================\n\n");
            
            printf("TROUBLESHOOTING STEPS:\n");
            printf("1. Check all connections:\n");
            printf("   - SDA/CS  (RC522 pin 5) -> GPIO 21\n");
            printf("   - SCK     (RC522 pin 1) -> GPIO 18\n");
            printf("   - MOSI    (RC522 pin 2) -> GPIO 23\n");
            printf("   - MISO    (RC522 pin 3) -> GPIO 19\n");
            printf("   - RST     (RC522 pin 6) -> GPIO 22\n");
            printf("   - GND     (RC522 pin 4) -> ESP32 GND\n");
            printf("   - 3.3V    (RC522 pin 8) -> ESP32 3.3V\n");
            printf("2. Make sure RC522 is getting 3.3V (NOT 5V!)\n");
            printf("3. Check for loose connections\n");
            printf("4. Try different RC522 module\n");
            
            while (1) {
                vTaskDelay(pdMS_TO_TICKS(1000));
            }
        }
        
        printf("\n");
        printf("RC522 is READY!\n");
        printf("Place RFID card near the reader...\n\n");
        
        bool card_present = false;
        uint32_t last_scan_time = 0;
        
        while (1) {
            bool detected = rc522_is_card_present();
            
            if (detected && !card_present) {
                card_present = true;
                printf("[DETECTED] Card found!\n");
                
                uint8_t uid[10] = {0};
                if (rc522_read_uid(uid)) {
                    // Convert UID to hex string
                    char uid_hex[32] = {0};

                    for (int i = 0; i < 4; i++) {
                        char tmp[4];
                        snprintf(tmp, sizeof(tmp), "%02X", uid[i]);
                        strcat(uid_hex, tmp);
                        if (i < 3) strcat(uid_hex, ":");
                    }

                    printf("[UID] %s\n", uid_hex);

                    // Check if this is a new UID or enough time has passed
                    uint32_t current_time = esp_timer_get_time() / 1000;
                    if (strcmp(uid_hex, last_uid) != 0 || (current_time - last_scan_time) > 5000) {
                        // Store this UID and timestamp
                        strcpy(last_uid, uid_hex);
                        last_scan_time = current_time;
                        
                        // Send to backend
                        printf("[HTTP] Sending scan to backend...\n");
                        send_scan_to_backend(uid_hex);
                    } else {
                        printf("[INFO] Same card detected recently, waiting...\n");
                    }
                }
                
            } else if (!detected && card_present) {
                card_present = false;
                printf("[REMOVED] Card removed\n\n");
            }
            
            vTaskDelay(pdMS_TO_TICKS(500));
        }
    }