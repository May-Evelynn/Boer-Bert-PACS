const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function logScan(tag_id, location_id, time, inout) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO logs (keyfob_id, facility_id, timestamp, in_out) VALUES (?, ?, ?, ?)", [tag_id, location_id, time, inout]);
        return result;
    } catch (error) {
        console.error('Error logging scan:', error);
        throw new Error('Error logging scan');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function getScans() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM logs");
        return rows;
    } catch (error) {
        console.error('Error retrieving scans:', error);
        throw new Error('Error retrieving scans');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function attachUserToKeyfob(user_id, keyfob_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = ? WHERE keyfob_id = ?", [user_id, keyfob_id]);
        return result;
    } catch (error) {
        console.error('Error attaching user to keyfob:', error);
        throw new Error('Error attaching user to keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function detachUserFromKeyfob(keyfob_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = NULL WHERE keyfob_id = ?", [keyfob_id]);
        return result;
    } catch (error) {
        console.error('Error detaching user from keyfob:', error);
        throw new Error('Error detaching user from keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function setKeyfobKey(keyfob_id, new_key) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET keyfob_key = ? WHERE keyfob_id = ?", [new_key, keyfob_id]);
        return result;
    } catch (error) {
        console.error('Error setting keyfob key:', error);
        throw new Error('Error setting keyfob key');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function getKeyfobs() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM keyfobs WHERE kapot = 0");
        return rows;
    } catch (error) {
        console.error('Error retrieving keyfobs:', error);
        throw new Error('Error retrieving keyfobs');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

// initialize new keyfob before linking to individual person
export async function initNewKeyfob(keyfob_key) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO keyfobs (keyfob_key) VALUES (?)", keyfob_key);
        return result;
    } catch (error) {
        console.error('Error initializing keyfob: ', error)
        throw new Error('Error initializing keyfob')
    } finally {
        if (conn) {conn.release();}
        await pool.end();
    }
}

export async function createTestLogs(amount) {
    function randomDate(start, end, startHour, endHour) {
        var date = new Date(+start + Math.random() * (end - start));
        var hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    const pool = mariadb.createPool(vpool);
    let conn;
    let finalQuery;
    let allFacilities;
    let fuckshit = [];
    try {
        finalQuery = "INSERT INTO logs (keyfob_id, facility_id, timestamp, in_out) VALUES ";

        conn = await pool.getConnection();
        allFacilities = await conn.query("select * from facilities");
        console.log(allFacilities);
        
        for (let x = 0; x < allFacilities.length; x++) {
            console.log("fuckshit: ", fuckshit);
            fuckshit.push({"out" : allFacilities[x].facilities_id});
        }
        
        // get rand datetime within set timespan (3 months)
        randDatetime = randomDate(new Date(2023, 0, 1), new Date(2023,2,31), 6, 22);
        const epochTime = Date.parse(randDatetime);

        for (x = 0; x < amount; x++){
            const curFacility = allFacilities[getRandomInt(allFacilities.length)];
            // if 
            finalQuery += "(1, ${curFacility[1]}, ${epochTime}, )"
        }
        
        await conn.query(finalQuery);
    } catch {
        console.error('Error inserting rows: ', error)
        throw new Error('Error inserting rows')
    } finally {
        if (conn) {conn.release();}
        await pool.end();
    }
}
// get rand facility
// check if last time curFacility scan = in/out and flip
// add values to finalQuery
// continue to next iteration

