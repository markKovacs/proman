
# Database connection and run statements

import psycopg2
import psycopg2.extras

import config


def query(sql, parameters, fetch):
    """Establish connection and run SQL statement."""
    conn = None
    try:
        conn = psycopg2.connect(config.DNS)

    except psycopg2.OperationalError as oe:
        print("Could NOT connect to database.")
        print(oe)

    else:
        conn.autocommit = True
        if fetch == "all" or fetch == "one":
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                result = run_statement(sql, parameters, fetch, cursor)
        else:
            with conn.cursor() as cursor:
                result = run_statement(sql, parameters, fetch, cursor)
        if result:
            return result

    finally:
        if conn:
            conn.close()


def run_statement(sql, parameters, fetch, cursor):
    """Run an SQL statement."""
    if parameters:
        cursor.execute(sql, parameters)
    else:
        cursor.execute(sql)

    result = None
    if fetch == "all":
        result = cursor.fetchall()
    elif fetch == "one":
        result = cursor.fetchone()
    elif fetch == "col":
        result = tuple(row[0] for row in cursor)
    elif fetch == "cell":
        result = cursor.fetchone()[0]

    if result:
        return result
