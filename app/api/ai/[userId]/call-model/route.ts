// This api route calls the model (if exists) and returns a predition image
// should work the same as call_model from previous main.py

// Might have to create a predictions and then get the prediction
// check out Replicate HTTP api docs: https://replicate.com/docs/reference/http

// Route to call from the front-end: api/{$user.id}/useModel

// req.body = {
//   prompt: prompt,
//   id: model.id
// }

// res.body = {
//   url: url
// }

import replicateClient from '../../../../core/clients/replicate';
import { supabase } from '../../../../supabaseClient';
import { NextResponse } from 'next/server';

// TODO: translate fine_tune_model to work with replicate (show follow similar steps)
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Get request data
    const req = await request.json();
    console.log(req);

    const prompt = req.instance_prompt as string;
    const id = req.run_id as string;
    const user = req.user_id as string;

    // Fetch model data
    const modelResponse = await fetch(
      `https://dreambooth-api-experimental.replicate.com/v1/trainings/${id}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!modelResponse.ok) {
      throw new Error(
        `Failed to fetch model data. Status: ${modelResponse.status}`
      );
    }

    const modelData = await modelResponse.json();
    console.log(modelData.version);

    // Call model
    const predictionData = await replicateClient.post(
      `https://api.replicate.com/v1/predictions`,
      {
        input: {
          prompt: prompt,
          negative_prompt: process.env.REPLICATE_NEGATIVE_PROMPT,
          disable_safety_check: true,
          prompt_strength: 0.8,
          guidance_scale: 7.5
        },
        version: modelData.version
      }
    );

    // Insert prediction into supabase
    await supabase.from('predictions').insert({
      user_id: user,
      created_at: predictionData.data.created_at,
      status: predictionData.data.status,
      url: predictionData.data.output,
      id: predictionData.data.id,
      prompt: predictionData.data.input.prompt
    });

    return NextResponse.json({ prediction_id: predictionData.data.id });
  } catch (error) {
    console.error('Call-model error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
