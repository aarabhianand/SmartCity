--Procedure being used :
delimiter $$
create procedure schedule_maintenance_after_issue_reported(
    IN p_citizen_id INT,
    IN p_infrastructure_id INT,
    IN p_reason VARCHAR(255),
    IN p_clarity TEXT,
    IN p_priority VARCHAR(50)
)
begin
    insert into maintenance_request (request_date,status,issues_description,citizen_id,infrastructure_id)
    values (CURRENT_TIMESTAMP,'PENDING',CONCAT('Issue reported: ', p_reason, ' - ', p_clarity),p_citizen_id,p_infrastructure_id);
end$$
delimiter ;

--Trigger being used 
delimiter  //

create trigger check_inspection_date
before insert on inspection
for each row
begin
    declare current_date DATE;
    set current_date = CURDATE();
    
    if NEW.inspection_date < current_date then
        SIGNAL SQLSTATE '45000' 
        set MESSAGE_TEXT = 'Inspection date cannot be in the past.';
    end if;
end //
delimiter ;

--SQL queries: 

--1) Find the number of infrastructures a given utility provider services: (aggregate query)
--Ans:
select provider_id, COUNT(infrastructure_id) AS num_of_infra from infrastructure group by provider_id;

--2) Display each provider's total count of unresolved 
--maintenance requests( only if more than 3 ) for each infrastructure type, along with the earliest request date 
--for these unresolved requests (nested query)
--Ans:
select provider_id,infrastructure_type,min(request_date) as earliest_request_date,count(request_id) as unresolved_requests_count
from 
(select mr.request_id,mr.request_date,mr.status,i.provider_id,i.type as infrastructure_type
from maintenance_request as mr join infrastructure as i
 on mr.infrastructure_id = i.infrastructure_id
where mr.status in ('pending', 'in_progress', 'on_hold')
) as subquery
group by 
    provider_id, infrastructure_type
having 
    count(request_id) > 3
order by 
    unresolved_requests_count desc, earliest_request_date;

--3) Retrieve the ID and name of each citizen who has reported a high-priority issue,
-- along with the reason for the issue
--Ans: 
select c.citizen_id,c.citizen_name,ri.reason as issue_reason
from citizen as c
join maintenance_request as mr on c.citizen_id = mr.citizen_id
join reported_issues as ri on mr.infrastructure_id = ri.infrastructure_id
where ri.priority = 'high';

--4) Retrieve a list of sensor IDs, types, and their locations, along with the associated infrastructure ID and its last calibration date, f
--or all sensors that were last calibrated in the past year
--Ans: 
select sensor_id,type,location,infrastructure_id,last_calibration_date
from environmental_sensors
where last_calibration_date >= date_sub(curdate(), interval 1 year);

--5) Return a list of inspectors along with the number of inspections they have conducted and the average sensor reading value 
--for the infrastructures they inspected
--Ans:
select ins.inspector_name,ins.spec,COUNT(i.inspection_id) AS number_of_inspections,AVG(es.value) AS average_sensor_value
from inspector ins
join inspection i ON ins.inspector_id = i.inspector_id
join environmental_sensors es ON i.infrastructure_id = es.infrastructure_id
group by ns.inspector_id
having COUNT(i.inspection_id) > 1
order by number_of_inspections DESC;










