const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bcrypt1 = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001; // Backend server port

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MySQL connection for the main database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Folklore@2004', // Replace with your actual password
    database: 'smartcity',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        throw err;
    }
    console.log('MySQL Connected...');
});

// Signup Route
app.post('/signup', async (req, res) => {
    const {
        username,
        email,
        password,
        role,
        subrole,
        fullName,
        address,
        contactNumber,
        altContactNumber,
        specialization,
        providerName,
        serviceType,
        serviceArea,
        operationalHours,
    } = req.body;

    console.log(req.body);
    // Validate inputs
    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'Username, email, password, and role are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the main 'users' table
        const userQuery = `
            INSERT INTO users (username, email, password_hash, role) 
            VALUES (?, ?, ?, ?)
        `;
        db.query(userQuery, [username, email, hashedPassword, role], (err, userResult) => {
            if (err) {
                console.error('Error inserting into users table:', err);
                return res.status(400).json({ error: 'Error signing up.' });
            }

            const userId = userResult.insertId; // Get the new user ID

            // Additional role-specific inserts
            if (role === 'Citizen') {
                const citizenQuery = `
                    INSERT INTO citizen (citizen_name, address, contact_number, alternate_contact_number, email) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(citizenQuery, [fullName, address, contactNumber, altContactNumber, email], (err) => {
                    if (err) {
                        console.error('Error inserting into citizens table:', err);
                        return res.status(400).json({ error: 'Error creating citizen record.' });
                    }
                    res.status(201).json({
                        message: 'Citizen user created successfully.',
                        user: { id: userId, username, role },
                    });
                });
            } else if (role === 'Utility Provider' && subrole==='General Utility Provider') {
                const providerQuery = `
                    INSERT INTO utility_provider(provider_name, service_type, service_area, operational_hours,email)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(providerQuery, [providerName, serviceType, serviceArea, operationalHours,email], (err) => {
                    if (err) {
                        console.error('Error inserting into providers table:', err);
                        return res.status(400).json({ error: 'Error creating provider record.' });
                    }
                    res.status(201).json({
                        message: 'Utility Provider created successfully.',
                        user: { id: userId, username, role },
                    });
                });
            } else if (role === 'Inspector') {
                const inspectorQuery = `
                    INSERT INTO inspector (inspector_name, spec, phone_number, email)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(inspectorQuery, [fullName, specialization, contactNumber, email], (err) => {
                    if (err) {
                        console.error('Error inserting into inspectors table:', err);
                        return res.status(400).json({ error: 'Error creating inspector record.' });
                    }
                    res.status(201).json({
                        message: 'Inspector created successfully.',
                        user: { id: userId, username, role },
                    });
                });
            } else if (role === 'Admin') {
                const AdminQuery = `
                    INSERT INTO admin (username,email)
                    VALUES (?, ?)
                `;
                db.query(AdminQuery, [username,email], (err) => {
                    if (err) {
                        console.error('Error inserting into admin table:', err);
                        return res.status(400).json({ error: 'Error creating admin record.' });
                    }
                    res.status(201).json({
                        message: 'Admin created successfully.',
                        user: { id: userId, username, role },
                    });
                });
            }
            else {
                res.status(201).json({
                    message: 'User created successfully.',
                    user: { id: userId, username, role },
                });
            }
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Example in Node.js/Express
//const bcrypt = require('bcryptjs');


app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT user_id, username, role, password_hash, email FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (error) {
                console.error("Server error:", error);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length > 0) {
                const user = results[0];

                bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return res.status(500).json({ message: 'Server error' });
                    }

                    if (isMatch) {
                        // Remove spaces from the role field
                        const roleWithoutSpaces = user.role.replace(/\s+/g, '');

                        // Define the table and ID field based on the user's role
                        let table = '';
                        let idField = '';
                        
                        // Determine which table to join based on the role
                        if (roleWithoutSpaces === 'Citizen') {
                            table = 'citizen';
                            idField = 'citizen_id';
                        } else if (roleWithoutSpaces === 'Inspector') {
                            table = 'inspector';
                            idField = 'inspector_id';
                        } else if (roleWithoutSpaces === 'UtilityProvider') {
                            table = 'utility_provider';
                            idField = 'provider_id';
                        } else if (roleWithoutSpaces === 'Admin') {
                            table = 'admin';
                            idField = 'admin_id';
                        }
                        else {
                            return res.status(401).json({ message: 'Invalid role' });
                        }

                        // Join the users table with the specific role table to get the ID
                        const query = `
                            SELECT u.user_id, u.username, u.role, u.email, r.${idField} 
                            FROM users u
                            JOIN ${table} r ON u.email = r.email
                            WHERE u.email = ?
                        `;

                        db.query(query, [email], (joinError, joinResults) => {
                            if (joinError) {
                                console.error("Error during join:", joinError);
                                return res.status(500).json({ message: 'Server error' });
                            }

                            if (joinResults.length > 0) {
                                const userWithRoleData = joinResults[0];

                                // Remove spaces from the role field in the response as well
                                userWithRoleData.role = userWithRoleData.role.replace(/\s+/g, '');

                                console.log("Login response with role data:", userWithRoleData);  // Debugging
                                res.json(userWithRoleData); // Send response with the user role and specific ID
                            } else {
                                res.status(401).json({ message: 'Invalid credentials' });
                            }
                        });
                    } else {
                        res.status(401).json({ message: 'Invalid credentials' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    );
});


// Backend route to fetch profile based on role
app.get('/api/profile/:role', (req, res) => {
    const { role } = req.params;
    const email = req.query.email;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: 'Email parameter is required' });
    }

    // Define SQL query based on the role
    let query = '';
    if (role === 'Inspector') {
        query = `
            SELECT inspector.inspector_name, inspector.email, inspector.phone_number, inspector.spec
            FROM users
            JOIN inspector ON users.email = inspector.email
            WHERE users.email = ?`;
    } else if (role === 'Citizen') {
        query = `
            SELECT citizen.citizen_name, citizen.email, citizen.contact_number, citizen.alternate_contact_number,citizen.address
            FROM users
            JOIN citizen ON users.email = citizen.email
            WHERE users.email = ?`;
    } else if (role === 'UtilityProvider') {
        query = `
            SELECT utility_provider.email, utility_provider.provider_name, utility_provider.service_type, utility_provider.service_area, 
                   utility_provider.contact_number,utility_provider.no_of_members, utility_provider.operational_hours
            FROM users
            JOIN utility_provider ON users.email = utility_provider.email
            WHERE users.email = ?`;
    } else if (role === 'Admin') {
        query = `
            SELECT users.username, users.email
            FROM users
            JOIN admin ON users.email = admin.email
            WHERE users.email = ?`;
    } else {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Execute the query
    db.query(query, [email], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Return the profile if found
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    });
});

app.post('/api/profile/update/:role', (req, res) => {
    const { role } = req.params;
    const { email, ...profileData } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required for updating profile' });
    }

    let query = '';
    let values = [];

    if (role === 'Inspector') {
        query = `
            UPDATE inspector
            SET inspector_name = ?, phone_number = ?, spec = ?
            WHERE email = ?`;
        values = [profileData.inspector_name, profileData.phone_number, profileData.spec, email];
    } else if (role === 'Citizen') {
        query = `
            UPDATE citizen
            SET citizen_name = ?, contact_number = ?, alternate_contact_number = ?, address = ?
            WHERE email = ?`;
        values = [profileData.citizen_name, profileData.contact_number, profileData.alternate_contact_number, profileData.address, email];
    } else if (role === 'UtilityProvider') {
        query = `
            UPDATE utility_provider
            SET provider_name = ?, service_type = ?, service_area = ?, contact_number = ?, operational_hours = ?
            WHERE email = ?`;
        values = [profileData.provider_name, profileData.service_type, profileData.service_area, profileData.contact_number, profileData.operational_hours, email];
    } else if (role === 'Admin') {
        query = `
            UPDATE admin
            SET username = ?
            WHERE email = ?`;
        values = [profileData.username, email];
    } else {
        return res.status(400).json({ message: 'Invalid role' });
    }

    db.query(query, values, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: 'Failed to update profile. Server error' });
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'Profile not found or no changes made' });
        }
    });
});


app.get('/infrastructure', (req, res) => {
    const query = `
        SELECT infrastructure_id, type, location, status, image_url 
        FROM infrastructure
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching infrastructures:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Fetch detailed data for a specific infrastructure by ID
app.get('/infrastructure/:id', (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, type } = req.query;

    // Query infrastructure details
    db.query(
        'SELECT type, location, status, image_url FROM infrastructure WHERE infrastructure_id = ?',
        [id],
        (error, infrastructureResult) => {
            if (error) {
                console.error('Error fetching infrastructure:', error);
                return res.status(500).json({ error: 'Failed to fetch infrastructure details' });
            }

            const infrastructure = infrastructureResult[0];
            if (!infrastructure) {
                return res.status(404).json({ message: 'Infrastructure not found' });
            }

            // Query utility provider details
            db.query(
                'SELECT provider_name, contact_number FROM infrastructure JOIN utility_provider WHERE infrastructure.provider_id = utility_provider.provider_id AND infrastructure_id = ?',
                [id],
                (error, providerResult) => {
                    if (error) {
                        console.error('Error fetching provider:', error);
                        return res.status(500).json({ error: 'Failed to fetch provider details' });
                    }

                    const provider = providerResult[0] || {};

                    // Query sensor data with optional filters
                    let sensorQuery = 'SELECT datetime_collection, value, type FROM environmental_sensors WHERE infrastructure_id = ?';
                    const params = [id];

                    // Add filters if provided
                    if (startDate) {
                        sensorQuery += ' AND datetime_collection >= ?';
                        params.push(startDate);
                    }

                    if (endDate) {
                        sensorQuery += ' AND datetime_collection <= ?';
                        params.push(endDate);
                    }

                    if (type) {
                        sensorQuery += ' AND type = ?';
                        params.push(type);
                    }

                    // Execute query for sensor data
                    db.query(sensorQuery, params, (error, sensorDataResult) => {
                        if (error) {
                            console.error('Error fetching sensor data:', error);
                            return res.status(500).json({ error: 'Failed to fetch sensor data' });
                        }

                        res.json({
                            infrastructure,
                            provider_name: provider.provider_name,
                            contact_number: provider.contact_number,
                            sensorData: sensorDataResult,
                        });
                    });
                }
            );
        }
    );
});


app.get('/infrastructure/:id/sensor-types', (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT DISTINCT type FROM environmental_sensors WHERE infrastructure_id = ?',
        [id],
        (error, sensorTypes) => {
            if (error) {
                console.error('Error fetching sensor types:', error);
                return res.status(500).json({ error: 'Failed to fetch sensor types' });
            }
            res.json({ sensorTypes: sensorTypes.map(row => row.type) });
        }
    );
});

app.post('/api/report-issue', (req, res) => {
    const { infrastructureId, reason, clarity, priority, additionalIssues } = req.body;

    // Check if all fields are present
    if (!reason || !clarity || !priority || !additionalIssues) {
        console.log('Validation failed: Missing fields in the request body');
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Insert the issue data into the database
    const query = `
        INSERT INTO reported_issues (infrastructure_id, reason, clarity, priority, additional_issues)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [infrastructureId, reason, clarity, priority, additionalIssues], (err, result) => {
        if (err) {
            console.error('Error reporting issue:', err);
            return res.status(500).json({ error: 'Error reporting the issue.' });
        }

        console.log('Issue data inserted successfully:', result);

        // Call the stored procedure after reporting the issue
        const procedureQuery = `
            CALL schedule_maintenance_after_issue_reported(?, ?, ?, ?);
        `;

        db.query(procedureQuery, [infrastructureId, reason, clarity, priority], (procErr, procResult) => {
            if (procErr) {
                console.error('Error executing stored procedure:', procErr);
                return res.status(500).json({ error: 'Error scheduling maintenance.' });
            }

            console.log('Maintenance scheduled successfully via stored procedure:', procResult);

            res.status(201).json({
                message: 'Issue reported successfully.',
                issueId: result.insertId
            });
        });
    });
});


// Endpoint to schedule the maintenance request by setting the provider_id
app.post('/api/schedule-request', (req, res) => {
    const { request_id, provider_id } = req.body;

    const query = `
        UPDATE maintenance_request
        SET provider_id = ?,status='ASSIGNED'
        WHERE request_id = ?
    `;

    db.query(query, [provider_id, request_id], (error, results) => {
        if (error) {
            console.error('Error scheduling maintenance request:', error);
            return res.status(500).json({ message: 'Error scheduling maintenance request' });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Request scheduled successfully' });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    });
});

// Endpoint to cancel the maintenance request by changing the status
app.post('/api/cancel-request', (req, res) => {
    const { request_id } = req.body;

    const query = `
        UPDATE maintenance_request
        SET status = 'CANCELLED'
        WHERE request_id = ?
    `;

    db.query(query, [request_id], (error, results) => {
        if (error) {
            console.error('Error canceling maintenance request:', error);
            return res.status(500).json({ message: 'Error canceling maintenance request' });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Request cancelled successfully' });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    });
});


app.get('/api/infrastructures/:providerId', (req, res) => {
    const { providerId } = req.params;
    const query = `
        SELECT CONCAT(type, ' ', location) AS infrastructure_name
        FROM infrastructure WHERE provider_id = ?
    `;
    db.query(query, [providerId], (error, results) => {
        if (error) {
            console.error('Error fetching infrastructures:', error);
            return res.status(500).json({ message: 'Error fetching infrastructures' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to fetch maintenance requests by providerId
app.get('/api/maintenance-requests/:providerId', (req, res) => {
    const { providerId } = req.params;
    const query = `
        SELECT  mr.request_id, mr.request_date, mr.status, mr.issues_description, CONCAT(type, ' ', location) AS infrastructure_name
        FROM maintenance_request AS mr
        INNER JOIN infrastructure AS i ON mr.infrastructure_id = i.infrastructure_id
        WHERE i.provider_id = ? && mr.status IN ('PENDING','ASSIGNED','CANCELLED')
        ORDER BY mr.request_date DESC
    `;
    db.query(query, [providerId], (error, results) => {
        if (error) {
            console.error('Error fetching maintenance requests:', error);
            return res.status(500).json({ message: 'Error fetching maintenance requests' });
        }
        res.status(200).json(results);
    });
});

app.get("/api/infrastructuresfor", (req, res) => {
    const query = "SELECT infrastructure_id, display FROM infrastructure_view";
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
});
  
app.post("/api/schedule-inspection", (req, res) => {
    const { infrastructure_id, inspection_date, inspector_id } = req.body;

    if (!inspector_id) {
      return res.status(401).json({ error: "Inspector not logged in" });
    }

    const queryInfrastructure = "SELECT display FROM infrastructure_view WHERE infrastructure_id = ?";
    db.query(queryInfrastructure, [infrastructure_id], (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ error: "Infrastructure not found" });
      }

      const infrastructureDisplay = result[0].display;
      const inspectionDateObj = new Date(inspection_date);
      const nextDateObj = new Date(inspectionDateObj);
      nextDateObj.setMonth(inspectionDateObj.getMonth() + 2);
      if (nextDateObj.getDate() !== inspectionDateObj.getDate()) {
        nextDateObj.setDate(0);
      }
      const next_date = nextDateObj.toISOString().split("T")[0];

      // Insert new inspection and retrieve the inspection_id
      const queryInspection = `INSERT INTO inspection (infrastructure_id, inspection_date, next_date, inspector_id) VALUES (?, ?, ?, ?)`;
      db.query(queryInspection, [infrastructure_id, inspection_date, next_date, inspector_id], (err, result) => {
        if (err) {
          if (err.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({ error: err.sqlMessage });
          }
          return res.status(500).json({ error: "Database error" });
        }

        const newInspectionId = result.insertId;

        // Retrieve all inspection_ids associated with the inspector
        const queryAllInspections = "SELECT inspection_id FROM inspection WHERE inspector_id = ?";
        db.query(queryAllInspections, [inspector_id], (err, inspections) => {
          if (err) {
            return res.status(500).json({ error: "Failed to retrieve inspections for the inspector" });
          }

          // Extract all inspection IDs as an array
          const allInspectionIds = inspections.map(row => row.inspection_id);
          // Join all inspection IDs into a comma-separated string
          const assignedInspections = allInspectionIds.join(',');

          // Update the inspector's assigned_inspection column with all related inspection IDs
          const updateQuery = "UPDATE inspector SET assigned_inspection = ? WHERE inspector_id = ?";
          db.query(updateQuery, [assignedInspections, inspector_id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating inspector's assigned_inspection:", updateErr);
              return res.status(500).json({ error: "Failed to update inspector's assigned_inspection" });
            }

            // Successful response
            res.status(201).json({
              message: "Inspection scheduled successfully and inspector's assigned inspections updated.",
              assigned_inspections: assignedInspections,
            });
          });
        });
      });
    });
});
// Route to fetch assigned inspections for a specific inspector
app.get("/api/assigned-inspections", (req, res) => {
    const inspector_id = req.query.inspector_id; // Taking inspector_id from req.query

    if (!inspector_id) {
        return res.status(401).json({ error: "Inspector not logged in" });
    }

    const query = `
        SELECT inspector.inspector_id,infrastructure_view.display,inspection.inspection_date,inspection.inspection_id
        FROM inspector JOIN inspection
        ON FIND_IN_SET(inspection.inspection_id, inspector.assigned_inspection) > 0
        JOIN infrastructure_view
        ON inspection.infrastructure_id = infrastructure_view.infrastructure_id
        WHERE inspector.inspector_id = ? ORDER BY inspection.inspection_id;
    `;

    db.query(query, [inspector_id], (err, results) => {
        if (err) {
            console.error("Database error fetching assigned inspections:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log(results)
        res.json(results);
    });
});


// Route to mark an inspection as complete and reset inspector assignment
app.post("/api/complete-inspection", (req, res) => {
    const { inspector_id, inspection_id, recommendation, finding } = req.body;

    // Log received data to verify incoming request
    console.log("Received data:", { inspector_id, inspection_id, recommendation, finding });

    // Ensure all necessary fields are provided
    if (!inspector_id || !inspection_id) {
        console.log("Error: Missing required fields");
        return res.status(400).json({ error: "Inspector ID and Inspection ID are required" });
    }

    // Update inspection with the recommendation and finding for the specified inspection_id
    const updateInspectionQuery = `
        UPDATE inspection
        SET recommendation = ?, finding = ?
        WHERE inspector_id = ? AND inspection_id = ?;
    `;

    // Log query and data before executing
    console.log("Executing updateInspectionQuery with data:", [recommendation, finding, inspector_id, inspection_id]);

    // Reset assigned_inspection by removing inspection_id after completion
    const resetInspectorQuery = `
        UPDATE inspector 
        SET assigned_inspection = 
            CASE 
                WHEN FIND_IN_SET(?, assigned_inspection) > 0 THEN
                    TRIM(BOTH ',' FROM REPLACE(CONCAT(',', assigned_inspection, ','), CONCAT(',', ?, ','), ','))
                ELSE 
                    assigned_inspection
            END
        WHERE inspector_id = ?;
    `;

    // Run the update inspection query
    db.query(updateInspectionQuery, [recommendation, finding, inspector_id, inspection_id], (err, result) => {
        if (err) {
            console.error("Error updating inspection:", err);
            return res.status(500).json({ error: "Failed to update inspection" });
        }

        // Log success of the inspection update
        console.log("Inspection updated successfully:", result);

        // Run the reset assigned inspection query
        console.log("Executing resetInspectorQuery with data:", [inspection_id, inspection_id, inspector_id]);

        db.query(resetInspectorQuery, [inspection_id, inspection_id, inspector_id], (err, result) => {
            if (err) {
                console.error("Error resetting inspector assigned inspection:", err);
                return res.status(500).json({ error: "Failed to reset inspector assigned inspection" });
            }

            // Log success of the reset
            console.log("Inspector's assigned inspection reset successfully:", result);

            // Successfully completed the update and reset
            res.json({ success: true });
        });
    });
});




app.get('/inspectors', (req, res) => {
    db.query('SELECT * FROM inspector', (err, results) => {
    if (err) throw err;
    res.json(results);
    });
});

app.get('/inspector/:id', (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM inspector WHERE inspector_id = ?', [id], (err, results) => {
            if (err) throw err;
            res.json(results[0]);
        });
    });

// Update inspector details (using POST instead of PUT)
app.post('/inspector/update/:id', async (req, res) => {
    const { id } = req.params;
    const { inspector_name, spec, assigned_inspection, phone_number, email } = req.body;

    const sql = `UPDATE inspector
                 SET inspector_name = ?, spec = ?, assigned_inspection = ?, phone_number = ?, email = ?
                 WHERE inspector_id = ?`;

    db.query(sql, [inspector_name, spec, assigned_inspection, phone_number, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating inspector' });
            console.log(result);
        }
        res.json({ message: 'Inspector updated successfully' });
    });
});

app.post('/inspector/delete/:id', async (req, res) => {
    const { id } = req.params; // Corrected this line to properly extract the id from params

    const sql = `DELETE FROM inspector WHERE inspector_id = ?`; // Ensure the column name matches

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);  // Added proper error logging
            return res.status(500).json({ error: 'Error deleting inspector' });
        }
        // You can check if any rows were affected
        if (result.affectedRows > 0) {
            res.json({ message: 'Inspector deleted successfully' });
        } else {
            res.status(404).json({ error: 'Inspector not found' });
        }
    });
});


app.get('/citizens', (req, res) => {
    db.query('SELECT * FROM citizen', (err, results) => {
    if (err) throw err;
    res.json(results);
    });
});

app.get('/citizen/:id', (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM citizen WHERE citizen_id = ?', [id], (err, results) => {
            if (err) throw err;
            res.json(results[0]);
        });
    });

// Update inspector details (using POST instead of PUT)
app.post('/citizen/update/:id', async (req, res) => {
    const { id } = req.params;
    const { citizen_name, address, contact_number, alternate_contact_number, email } = req.body;

    const sql = `UPDATE citizen
                 SET citizen_name = ?, address = ?, contact_number = ?, alternate_contact_number = ?, email = ?
                 WHERE citizen_id = ?`;

    db.query(sql, [citizen_name, address, contact_number, alternate_contact_number, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating citizen' });
            console.log(result);
        }
        res.json({ message: 'Citizen updated successfully' });
    });
});

app.post('/citizen/delete/:id', async (req, res) => {
    const { id } = req.params; // Corrected this line to properly extract the id from params

    const sql = `DELETE FROM citizen WHERE citizen_id = ?`; // Ensure the column name matches

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);  // Added proper error logging
            return res.status(500).json({ error: 'Error deleting citizen' });
        }
        // You can check if any rows were affected
        if (result.affectedRows > 0) {
            res.json({ message: 'Citizen deleted successfully' });
        } else {
            res.status(404).json({ error: 'Citizen not found' });
        }
    });
});


app.get('/infrastructures', (req, res) => {
    db.query('SELECT * FROM infrastructure', (err, results) => {
    if (err) throw err;
    res.json(results);
    });
});

app.post('/infrastructures', (req, res) => {
    const { type, location, installed_date, status, provider_id, super_infrastructure_id, image_url } = req.body;

    // SQL query to insert new infrastructure data
    const query = `
        INSERT INTO infrastructure (type, location, installed_date, status, provider_id, super_infrastructure_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [type, location, installed_date, status, provider_id, super_infrastructure_id, image_url], (err, results) => {
        if (err) {
            console.error('Error inserting new infrastructure:', err);
            return res.status(500).send('Error inserting new infrastructure');
        }
        res.status(201).send({ message: 'New infrastructure added successfully', infrastructure_id: results.insertId });
    });
});



app.post('/citizens', (req, res) => {
    const { citizen_name, address, contact_number, alternate_contact_number,email } = req.body;

    // SQL query to insert new infrastructure data
    const query = `
        INSERT INTO citizen (citizen_name,address, contact_number, alternate_contact_number,email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [citizen_name, address, contact_number, alternate_contact_number,email], (err, results) => {
        if (err) {
            console.error('Error inserting new citizen:', err);
            return res.status(500).send('Error inserting new citizen');
        }
        res.status(201).send({ message: 'New citizen added successfully', citizen_id: results.insertId });
    });
});


app.post('/inspectors', (req, res) => {
    const { inspector_name, phone_number,email,spec } = req.body;

    // SQL query to insert new infrastructure data
    const query = `
        INSERT INTO inspector (inspector_name, phone_number,email,spec)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [inspector_name, phone_number,email,spec], (err, results) => {
        if (err) {
            console.error('Error inserting new citizen:', err);
            return res.status(500).send('Error inserting new citizen');
        }
        res.status(201).send({ message: 'New citizen added successfully', citizen_id: results.insertId });
    });
});


app.get('/infrastructures/:id', (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM infrastructure WHERE infrastructure_id = ?', [id], (err, results) => {
            if (err) throw err;
            res.json(results[0]);
        });
    });

// Update inspector details (using POST instead of PUT)
app.post('/infrastructures/update/:id', async (req, res) => {
    const { id } = req.params;
    const { type, location, installed_date, status, image_url,provider_id,super_infrastructure_id } = req.body;

    // Validate input
    if (!type || !location || !installed_date || !status || !image_url || !provider_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert installed_date to MySQL format
    const mysqlFormattedDate = new Date(installed_date).toISOString().slice(0, 19).replace('T', ' ');

    const sql = `UPDATE infrastructure
                 SET type = ?, location = ?, installed_date = ?, status = ?, image_url = ?, provider_id = ?, super_infrastructure_id = ?
                 WHERE infrastructure_id = ?`;

    db.query(sql, [type, location, mysqlFormattedDate, status, image_url,provider_id,super_infrastructure_id, id], (err, result) => {
        if (err) {
            console.log(err);  // Log error to console for debugging
            return res.status(500).json({ error: 'Error updating infrastructure' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Infrastructure not found' });
        }
        res.json({ message: 'Infrastructure updated successfully' });
    });
});



app.post('/infrastructures/delete/:id', async (req, res) => {
    const { id } = req.params; // Corrected this line to properly extract the id from params

    const sql = `DELETE FROM infrastructure WHERE infrastructure_id = ?`; // Ensure the column name matches

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);  // Added proper error logging
            return res.status(500).json({ error: 'Error deleting infrastructure' });
        }
        // You can check if any rows were affected
        if (result.affectedRows > 0) {
            res.json({ message: 'Infrastructure deleted successfully' });
        } else {
            res.status(404).json({ error: 'Infrastructure not found' });
        }
    });
});



app.get('/providers', (req, res) => {
    db.query('SELECT * FROM utility_provider', (err, results) => {
    if (err) throw err;
    res.json(results);
    });
});

app.get('/provider/:id', (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM utility_provider WHERE provider_id = ?', [id], (err, results) => {
            if (err) throw err;
            res.json(results[0]);
        });
    });

// Update inspector details (using POST instead of PUT)
app.post('/provider/update/:id', async (req, res) => {
    const { id } = req.params;
    const { provider_name,service_type,service_area,contact_number,email,no_of_members,operational_hours } = req.body;

    const sql = `UPDATE utility_provider
                 SET provider_name = ?, service_type = ?, service_area = ?, contact_number = ?, email = ?, no_of_members = ?,operational_hours=?
                 WHERE provider_id = ?`;

    db.query(sql, [provider_name,service_type,service_area,contact_number,email,no_of_members,operational_hours, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating Provider' });
            console.log(result);
        }
        res.json({ message: 'Provider updated successfully' });
    });
});

app.post('/provider/delete/:id', async (req, res) => {
    const { id } = req.params; // Corrected this line to properly extract the id from params

    const sql = `DELETE FROM utility_provider WHERE provider_id = ?`; // Ensure the column name matches

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);  // Added proper error logging
            return res.status(500).json({ error: 'Error deleting provider' });
        }
        // You can check if any rows were affected
        if (result.affectedRows > 0) {
            res.json({ message: 'Provider deleted successfully' });
        } else {
            res.status(404).json({ error: 'Provider not found' });
        }
    });
});



app.post('/providers', (req, res) => {
    const { provider_name,service_type,service_area,contact_number,email,no_of_members,operational_hours } = req.body;

    // SQL query to insert new infrastructure data
    const query = `
        INSERT INTO utility_provider (provider_name,service_type,service_area,contact_number,email,no_of_members,operational_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [provider_name,service_type,service_area,contact_number,email,no_of_members,operational_hours], (err, results) => {
        if (err) {
            console.error('Error inserting new provider:', err);
            return res.status(500).send('Error inserting new provier');
        }
        res.status(201).send({ message: 'New provider added successfully', provider_id: results.insertId });
    });
});


app.post('/usersc', (req, res) => {
    const { username, email, password_hash } = req.body;
    
    // Explicitly set role to 'citizen'
    const role = 'Citizen';

    const query = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';

    db.query(query, [username, email, password_hash, role], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding user credentials');
        }
        res.status(200).send('User credentials added successfully');
    });
});


app.post('/usersup', (req, res) => {
    const { username, email, password_hash } = req.body;
    
    // Explicitly set role to 'citizen'
    const role = 'UtilityProvider';

    const query = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';

    db.query(query, [username, email, password_hash, role], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding user credentials');
        }
        res.status(200).send('User credentials added successfully');
    });
});


app.post('/add-credentials', (req, res) => {
    const { username, email, password_hash } = req.body;

    const role ='Inspector';
    const query = 'INSERT INTO users (username, email, password_hash,role) VALUES (?, ?, ?,?)';
    connection.query(query, [username, email, password_hash,role], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error inserting credentials', error: err });
        }
        res.status(200).json({ message: 'Credentials added successfully' });
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


