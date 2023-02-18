import { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "crypto";
import { document } from "../utils/dynamo";

interface TodoRequest {
  title: string,
  deadline: string
}

export const handler: APIGatewayProxyHandler = async (event)=>{
  const { user_id } = event.pathParameters
  const {title, deadline} = JSON.parse(event.body) as TodoRequest

  try {

    await document.put({
      TableName:"todos",
      Item: {
        id: randomUUID(),
        user_id,
        title,
        deadline: new Date(deadline).getTime(),
        done:false,
      }
    }).promise()

  } catch (error) {
    
    return {
      statusCode:500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    }

  }

  return {
    statusCode:201,
    body: JSON.stringify({
      message: 'To-do created',
    }),
  }
}