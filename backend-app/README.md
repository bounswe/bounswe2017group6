## Installation

* NOTE: Requires Python 3.6.3 and pip3
* You may use [virtualenv](https://virtualenv.pypa.io/en/stable/).
* install requirements
  * install psql with version >= v9.6
    * Also you must have a psql role with name of `interesthub_admin`
    * You also need have a database with name of `interesthub`
    * Please make sure that `interesthub_admin` role has required priviliges on `interesthub` database.
    * If you have dump of last version of the database (named `interesthub.sql`) you can import it with following command.
      * `$ pg_restore --host=localhost --username=interesthub_admin --password --dbname=interesthub -C interesthub.sql`
    * For more details (about password,host,dbname,username etc..), you may look /backend-app/interesthub/interesthub/settings.py.
  * `$ pip3 install -r requirements.txt`
* `$ python3 manage.py migrate`
* `$ python3 manage.py runserver`
* Go to `http://127.0.0.1:8000/`
