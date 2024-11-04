<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Access-Control-Allow-Methods: *");
	
	include 'DbConnect.php';
	$objDb = new DbConnect;
	$conn = $objDb->connect();
	
	$method = $_SERVER['REQUEST_METHOD'];

	if ($method == "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}
	switch($method) {

		case "GET":
	        $sql = "SELECT * FROM students";
	        $path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
	        if (isset($path[1]) && is_numeric($path[1])) {
	            $sql .= " WHERE id = :id";
	            $stmt = $conn->prepare($sql);
	            $stmt->bindParam(':id', $path[1], PDO::PARAM_INT);
	            if ($stmt->execute()) {
	                $student = $stmt->fetch(PDO::FETCH_ASSOC);
	                if (!empty($student['photo'])) {
                    	$student['photo'] = base64_encode($student['photo']);
                	}
	                if ($student) {
	                    echo json_encode($student);
	                } else {
	                    http_response_code(404);
	                    echo json_encode(['status' => 0, 'message' => 'User not found.']);
	                }
	            } else {
	                echo json_encode(['status' => 0, 'message' => 'Query execution failed.', 'error' => $stmt->errorInfo()]);
	            }
	        } else {
	            $stmt = $conn->prepare($sql);
	            if ($stmt->execute()) {
	                $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
	                // IMPORTANTE: Converte todas as imagens para Base64
            	foreach ($students as &$student) {
                	if (!empty($student['photo'])) {
                    	$student['photo'] = base64_encode($student['photo']);
                	}
            	}
	                echo json_encode($students);
	            } else {
	                echo json_encode(['status' => 0, 'message' => 'Query execution failed.', 'error' => $stmt->errorInfo()]);
	            }
	        }
	        break;

		case "POST":
			

			if ($_FILES['photo']['error'] == UPLOAD_ERR_OK) {
	        $photo = file_get_contents($_FILES['photo']['tmp_name']);
	        
	        $sql = "INSERT INTO students(name, email, phone, address, photo) VALUES(:name, :email, :phone, :address, :photo)";
	        $stmt = $conn->prepare($sql);
	        $stmt->bindParam(':name', $_POST['name']);
	        $stmt->bindParam(':email', $_POST['email']);
	        $stmt->bindParam(':phone', $_POST['phone']);
	        $stmt->bindParam(':address', $_POST['address']);
	        $stmt->bindParam(':photo', $photo, PDO::PARAM_LOB);
	        
	        if ($stmt->execute()) {
	            $response = ['status' => 1, 'message' => 'Record created Successfully.'];
	        } else {
	            $response = ['status' => 0, 'message' => 'Failed to create record.'];
	        }
	    	} else {
	        $response = ['status' => 0, 'message' => 'Failed to upload photo.'];
	    	}
	    	echo json_encode($response);
	    	break;

		case "PUT":
			$student = json_decode( file_get_contents('php://input'));
			$sql = "UPDATE students SET name = :name, email = :email, phone = :phone, address = :address, photo = :photo WHERE id = :id";
			$stmt = $conn->prepare($sql);
			$stmt->bindParam(':name', $student->name);
			$stmt->bindParam(':email', $student->email);
			$stmt->bindParam(':phone', $student->phone);
			$stmt->bindParam(':address', $student->address);
			$stmt->bindParam(':photo', $student->photo);
			$stmt->bindParam(':id', $student->id);
			if($stmt->execute()) {
				$response = ['status' => 1, 'message' => 'Record updated Successfully.'];
			} else {
				$response = ['status' => 1, 'message' => 'Failed to update record.'];
			} 
			echo json_encode($response);
			break;

		case "DELETE":
			$sql = "DELETE FROM students WHERE id = :id";
	        $path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
	        $stmt = $conn->prepare($sql);
	        $stmt->bindParam(':id', $path[1]);

	        if($stmt->execute()) {
	            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
	        } else {
	            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
	        }
	        echo json_encode($response);
	        break;
	}

?>