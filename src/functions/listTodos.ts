import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamo";


export const handler: APIGatewayProxyHandler = async (event)=>{
  const { user_id } = event.pathParameters
  
  const response = await document.scan({
    TableName: "todos",
    FilterExpression: "user_id = :user_id", 
    ExpressionAttributeValues: {
      ':user_id': user_id,
    }
  }).promise()

  if (response.Items.length === 0) {
    return {
      statusCode:400,
      body: JSON.stringify({message:'No to-do found for this user.'}),
    }
  }

  return {
    statusCode:201,
    body: JSON.stringify(response.Items),
  }
}