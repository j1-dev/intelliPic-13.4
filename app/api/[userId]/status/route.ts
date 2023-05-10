import { supabase } from "../../../supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const SUPABASE_TABLE_NAME = "finetuningruns";
  const userId = params.userId;

  const { data, error } = await supabase
    .from(SUPABASE_TABLE_NAME)
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.error();
  }

  const runId = data?.[0]?.run_id;

  if (runId !== null) {
    try {
      const modelResponse = await fetch(`https://dreambooth-api-experimental.replicate.com/v1/trainings/${runId}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const modelData = await modelResponse.json();

      return NextResponse.json({
        healthy: modelData.status === 'succeeded',
        model_id: runId,
      });
    } catch (error) {
      console.error("Model fetch error:", error);
      return NextResponse.error();
    }
  } else {
    return NextResponse.json({
      healthy: false,
      model_id: null,
    });
  }
}
