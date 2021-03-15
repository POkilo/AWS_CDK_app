package main

import (
	// "myPKG/go2"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Handler function Using AWS Lambda Proxy Request
// func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
// 	message := "Hello"
// 	return events.APIGatewayProxyResponse{
// 		Body: message, StatusCode: 200}, nil
// }
func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	message := "Hello this is function 2"
	// message := go2.Message()
	return events.APIGatewayProxyResponse{
		Body: message, StatusCode: 200}, nil
}

func main() {
	lambda.Start(Handler)
}
