Admin -

CREATE ROLE "city_admin";
GRANT ALL PRIVILEGES ON smartcity.* TO 'city_admin';


Citizen -

CREATE ROLE 'city_citizen';
GRANT SELECT ON smartcity.reported_issues TO 'city_citizen';
GRANT SELECT, UPDATE, INSERT ON smartcity.citizen TO 'city_citizen';
GRANT SELECT, UPDATE, INSERT ON smartcity.citizen TO 'city_citizen';


Inspector -

CREATE ROLE 'city_inspector';
GRANT SELECT ON smartcity.reports TO 'city_inspector';
GRANT SELECT, UPDATE, INSERT ON smartcity.inspection TO 'city_inspector';
GRANT SELECT, UPDATE, INSERT ON smartcity.inspector TO 'city_inspector';


Utility Provider -

CREATE ROLE 'city_provider';
GRANT SELECT ON smartcity.reports TO 'city_provider';
GRANT SELECT, UPDATE, INSERT ON smartcity.utility_provider TO 'city_provider';
GRANT SELECT, UPDATE, INSERT ON smartcity.maintenance_request TO 'city_provider';