<?php
session_start();

$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'pawpalace';

$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$createTableSQL = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($createTableSQL)) {
    die("Error creating table: " . $conn->error);
}

$errors = [];
$success = '';

// Check if running in CLI mode
if (php_sapi_name() === 'cli') {
    echo "This script is designed to be run through a web browser.\n";
    echo "Please access it via: http://localhost/PHPPrograms/Pawbbles/petdb/login.php\n";
    exit;
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['login'])) {
        
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);
        
        if (empty($email) || empty($password)) {
            $errors[] = "Please fill in all fields";
        } 
        else {
            $stmt = $conn->prepare("SELECT id, fullname, password FROM users WHERE email = ?");
            if (!$stmt) {
                $errors[] = "Database error: " . $conn->error;
            } else {
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows === 1) {
                    $user = $result->fetch_assoc();
                    if (password_verify($password, $user['password'])) {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_name'] = $user['fullname'];
                        header("Location: event.html");
                        exit();
                    } else {
                        $errors[] = "Invalid email or password";
                    }
                } else {
                    $errors[] = "Invalid email or password";
                }
                $stmt->close();
            }
        }
    } elseif (isset($_POST['register'])) {
        
        $fullname = trim($_POST['fullname']);
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);
        $confirm_password = trim($_POST['confirm-password']);
        $pet_type = isset($_POST['pet-type']) ? trim($_POST['pet-type']) : null;
        
        
        if (empty($fullname) || empty($email) || empty($password) || empty($confirm_password)) {
            $errors[] = "Please fill all required fields";
        } elseif ($password !== $confirm_password) {
            $errors[] = "Passwords do not match";
        } elseif (strlen($password) < 8) {
            $errors[] = "Password must be at least 8 characters long";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        } else {
           
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            if (!$stmt) {
                $errors[] = "Database error: " . $conn->error;
            } else {
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $stmt->store_result();
                
                if ($stmt->num_rows > 0) {
                    $errors[] = "Email already exists. Please use a different email or login.";
                } else {
                    
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    $insert_stmt = $conn->prepare("INSERT INTO users (fullname, email, password, pet_type) VALUES (?, ?, ?, ?)");
                    if (!$insert_stmt) {
                        $errors[] = "Database error: " . $conn->error;
                    } else {
                        $insert_stmt->bind_param("ssss", $fullname, $email, $hashed_password, $pet_type);
                        
                        if ($insert_stmt->execute()) {
                            $success = "Registration successful! You can now login.";
                            $active_tab = 'login'; 
                        } else {
                            $errors[] = "Registration failed. Please try again.";
                        }
                        $insert_stmt->close();
                    }
                }
                $stmt->close();
            }
        }
    }
}

$active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'login';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pawbbles - Login/Register</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <header>
        <div class="logo"><i class="fas fa-paw"></i> Pawbbles</div>
        <p style="font-size: 0.9rem;">Premium pet products & services for your furry friends</p>
    </header>
    
    <nav>
        <ul>
            <!-- <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li> -->
            <li>
                <a href="product.html"><i class="fas fa-shopping-bag"></i> Products</a>
                <ul class="dropdown-menu">
                    <li><a href="#">Food & Treats</a></li>
                    <li><a href="#">Toys</a></li>
                    <li><a href="#">Grooming</a></li>
                    <li><a href="#">Accessories</a></li>
                </ul>
            </li>
            <li><a href="training.html"><i class="fas fa-graduation-cap"></i> Training</a></li>
            <li><a href="service.html"><i class="fas fa-paw"></i> Services</a></li>
            <li><a href="event.html"><i class="fas fa-calendar-alt"></i> Events</a></li>
            <li><a href="profile.html"><i class="fas fa-user"></i> Profile</a></li>
        </ul>
    </nav>
    
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h2>Welcome!</h2>
                <p>Please login to your account or register as a new user</p>
            </div>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <?php foreach ($errors as $error): ?>
                        <p class="mb-0"><?php echo $error; ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($success)): ?>
                <div class="alert alert-success">
                    <p class="mb-0"><?php echo $success; ?></p>
                </div>
            <?php endif; ?>
            
            <ul class="nav nav-tabs" id="authTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link <?php echo $active_tab === 'login' ? 'active' : ''; ?>" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab">Login</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link <?php echo $active_tab === 'register' ? 'active' : ''; ?>" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab">Register</button>
                </li>
            </ul>
            
            <div class="tab-content" id="authTabsContent">
                <div class="tab-pane fade <?php echo $active_tab === 'login' ? 'show active' : ''; ?>" id="login" role="tabpanel">
                    <form method="post">
                        <div class="mb-3 input-icon">
                            <i class="fas fa-envelope"></i>
                            <input type="email" name="email" class="form-control" placeholder="Email Address" required>
                        </div>
                        
                        <div class="mb-3 input-icon">
                            <i class="fas fa-lock"></i>
                            <input type="password" name="password" class="form-control" placeholder="Password" required>
                        </div>
                        
                        <div class="mb-3 d-flex justify-content-between align-items-center">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="remember" name="remember">
                                <label class="form-check-label" for="remember">Remember me</label>
                            </div>
                            <a href="#" style="color: var(--primary); font-size: 0.9rem;">Forgot password?</a>
                        </div>
                        
                        <button type="submit" name="login" class="btn btn-primary w-100 mb-3">Login</button>
                        
                        <div class="auth-footer">
                            Don't have an account? <a href="?tab=register">Register here</a>
                        </div>
                    </form>
                </div>
                
                <div class="tab-pane fade <?php echo $active_tab === 'register' ? 'show active' : ''; ?>" id="register" role="tabpanel">
                    <form method="post">
                        <div class="mb-3">
                            <label for="fullname" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="fullname" name="fullname" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Create a password" required>
                            <div class="form-text">Minimum 8 characters</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="confirm-password" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="pet-type" class="form-label">Pet Type (Optional)</label>
                            <select class="form-select" id="pet-type" name="pet-type">
                                <option value="">Select your pet</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                            </select>
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="terms" name="terms" required>
                            <label class="form-check-label" for="terms">I agree to the <a href="#" style="color: var(--primary);">Terms & Conditions</a></label>
                        </div>
                        
                        <button type="submit" name="register" class="btn btn-primary w-100 mb-3">Create Account</button>
                        
                        <div class="auth-footer">
                            Already have an account? <a href="?tab=login">Login here</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-container">
            <div class="footer-column">
                <h3>About Pawbbles</h3>
                <p>We are dedicated to providing the best care for your pets through quality products, services, and community events.</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            
            <div class="footer-column">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Home</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> About Us</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Services</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Products</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Events</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h3>Services</h3>
                <ul>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Veterinary Care</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Grooming</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Training</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Day Care</a></li>
                    <li><a href="#"><i class="fas fa-chevron-right"></i> Boarding</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h3>Contact Us</h3>
                <ul>
                    <li><a href="#"><i class="fas fa-map-marker-alt"></i> 123 Pet Street, Mumbai</a></li>
                    <li><a href="#"><i class="fas fa-phone"></i> +91 9876543210</a></li>
                    <li><a href="#"><i class="fas fa-envelope"></i> info@pawbbles.com</a></li>
                    <li><a href="#"><i class="fas fa-clock"></i> Mon-Sat: 9AM - 8PM</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2025 Pawbbles. All Rights Reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </footer>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="js/script.js"></script>
</body>
</html>
<?php
$conn->close();
?>