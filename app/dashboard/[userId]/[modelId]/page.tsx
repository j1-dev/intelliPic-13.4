"use client"
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import styles from "../../../Home.module.css";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

async function post(url: string, body: any, callback: any) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then(callback);
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default function ModelPage(){
  const params = useParams();
  const id = params.userId;
  const model = params.modelId;
  const [instancePrompt, setInstancePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const [predictionId, setPredictionId] = useState("");
  const [queueingPrediction, setQueueingPrediction] = useState(false);

  // Save the component state to localStorage
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("modelPageState" + model, JSON.stringify({
        instancePrompt,
        imageUrl,
        predictionId,
        queueingPrediction,
      }));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };  
  }, [instancePrompt, imageUrl, predictionId, queueingPrediction, model]);

  // Load the component state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("modelPageState"+model);
    console.log(savedState);
    if (savedState) {
      const {
        instancePrompt: savedInstancePrompt,
        imageUrl: savedImageUrl,
        predictionId: savedPredictionId,
        queueingPrediction: savedQueueingPrediction,
      } = JSON.parse(savedState);

      setInstancePrompt(savedInstancePrompt);
      setImageUrl(savedImageUrl);
      setPredictionId(savedPredictionId);
      setQueueingPrediction(savedQueueingPrediction);
    }
  }, [id,model]);

  async function handleCallModel() {
    post(
      `/api/${id}/call-model`,
      {
        run_id: model,
        instance_prompt: instancePrompt,
        user_id: id,
      },
      (data: any) => {
        setPredictionId(data.prediction_id);
        setQueueingPrediction(true);
      }
    );
  }

  async function handleGetPrediction(){
    if(queueingPrediction){
      post(
        `/api/${id}/get-prediction`,
        {
          prediction_id: predictionId,
        },
        (data: any) => {
          console.log(data)
          if(data.status==="succeeded"){
            setImageUrl(data.output)
            setQueueingPrediction(false)
          }
        }
      )
    }
  }

  useInterval(() => handleGetPrediction(), 3000)
  
  return(
    <div>
      <main className={styles.main}>
        <div className={classNames(styles.step, styles.columnstep)}>
          <div className={styles.prompt}>
            <input
              className={classNames(styles.input, styles.promptinput)}
              value={instancePrompt}
              onChange={(e) => setInstancePrompt(e.target.value)}
              placeholder="' Retrato de primer plano de Davidrmk como un vikingo'"
            />
            <button
              onClick={handleCallModel}
              className={classNames(styles.button, styles.primary)}
              style={{ marginTop: 0 }}
            >
              Generar
            </button>
          </div>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={classNames(styles.image, styles.modeloutput)}
              alt="Generated image"
              width={400}
              height={400}
              src={imageUrl}
            />
          )}
        </div>
      </main>
    </div>

  )
}
