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
		
			function parseMultipartFormData() {
			    $data = [];
			    $rawData = file_get_contents("php://input");
			    $boundary = substr($rawData, 0, strpos($rawData, "\r\n"));
			    
			    $parts = array_slice(explode($boundary, $rawData), 1);
			    foreach ($parts as $part) {
			        if ($part == "--\r\n") break; 
			        
			        $part = trim($part);
			        if (empty($part)) continue;
			        
			        // Extract header and body
			        list($rawHeaders, $body) = explode("\r\n\r\n", $part, 2);
			        $rawHeaders = explode("\r\n", $rawHeaders);
			        $headers = [];
			        
			        foreach ($rawHeaders as $header) {
			            list($name, $value) = explode(':', $header);
			            $headers[strtolower(trim($name))] = trim($value);
			        }
			        
			        // Parse the name from the Content-Disposition header
			        if (isset($headers['content-disposition'])) {
			            preg_match('/name="([^"]+)"/', $headers['content-disposition'], $matches);
			            $name = $matches[1];
			            
			            // Handle file uploads
			            if (strpos($headers['content-disposition'], 'filename=') !== false) {
			                preg_match('/filename="([^"]+)"/', $headers['content-disposition'], $fileMatches);
			                $filename = $fileMatches[1];
			                $data[$name] = [
			                    'filename' => $filename,
			                    'content' => $body
			                ];
			            } else {
			                // Regular form fields
			                $data[$name] = trim($body);
			            }
			        }
			    }
			    return $data;
			}

			if ($_SERVER['REQUEST_METHOD'] === 'PUT' && empty($_POST) && empty($_FILES)) {
			    $parsedData = parseMultipartFormData();
			    
			    // Log para debug
			    error_log("Conteúdo de parsedData: " . print_r($parsedData, true));
			    
			    // Definindo valores em $_POST a partir de parsedData
			    foreach ($parsedData as $key => $value) {
			        $_POST[$key] = is_array($value) ? $value['content'] : $value;
			    }
			}

			// Logando o conteúdo de $_POST para verificar os dados
			error_log("Conteúdo de _POST: " . print_r($_POST, true));

			$id = $_POST['id'] ?? null;
			error_log("ID capturado: " . $id);  // Log para verificação do ID

			if (!$id) {
			    echo json_encode(['status' => 0, 'message' => 'ID is required for updating.']);
			    exit();
			}

			$name = $_POST['name'] ?? null;
			$email = $_POST['email'] ?? null;
			$phone = $_POST['phone'] ?? null;
			$address = $_POST['address'] ?? null;

			if (!$name || !$email || !$phone || !$address) {
			    echo json_encode(['status' => 0, 'message' => 'All fields are required.']);
			    exit();
			}

			// Verificando se a foto foi enviada
			$photo = null;
			if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
			    // Foto foi enviada, então processa a foto nova
			    $photo = file_get_contents($_FILES['photo']['tmp_name']);
			} elseif (isset($parsedData['photo']) && $parsedData['photo'] !== 'null') {
			    // Se o campo 'photo' não for 'null', então processa a foto enviada com os dados
			    $photo = $parsedData['photo']['content'];
			} 
			// Se não foi enviada uma foto nova, mantemos a foto anterior

			// SQL de update, sem alterar a foto caso ela não tenha sido enviada
			$sql = "UPDATE students SET name = :name, email = :email, phone = :phone, address = :address" . ($photo !== null ? ", photo = :photo" : "") . " WHERE id = :id";
			$stmt = $conn->prepare($sql);
			$stmt->bindParam(':name', $name);
			$stmt->bindParam(':email', $email);
			$stmt->bindParam(':phone', $phone);
			$stmt->bindParam(':address', $address);
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);

			if ($photo !== null) {
			    $stmt->bindParam(':photo', $photo, PDO::PARAM_LOB);
			}

			if ($stmt->execute()) {
			    echo json_encode(['status' => 1, 'message' => 'Record updated successfully.']);
			} else {
			    // Logando informações sobre o erro
			    error_log("Erro na execução do statement: " . print_r($stmt->errorInfo(), true));
			    
			    echo json_encode(['status' => 0, 'message' => 'Failed to update record.', 'error' => $stmt->errorInfo()]);
			}
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