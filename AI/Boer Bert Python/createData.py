import mariadb

# connection parameters
conn_params= {
    "user" : "root",
    "password" : "pass",
    "host" : "localhost",
    "database" : "BoerBert"
}

# Establish a connection
with mariadb.connect(**conn_params) as conn:
    with conn.cursor() as cursor:
        cursor.execute("Select * from keyfobs")
        # # retrieve data
        # cursor.execute("SELECT name, country_code, capital FROM countries")

        # print content
        row= cursor.fetchone()
        print(*row, sep=' ')
