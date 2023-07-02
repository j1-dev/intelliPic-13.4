'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/supabaseClient';
import { useEffect, useState } from 'react';
import ModelCard from '@/app/components/ModelCard';
import { PulseLoader } from 'react-spinners';

export default function DashboardPage() {
  const params = useParams();
  const userId = params.userId;
  const [models, setModels] = useState<any>();
  const [user, setUser] = useState<any>();
  const [modelTokens, setModelTokens] = useState<any>();

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error(error);
      } else {
        setModels(data);
      }
    };

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('user-data')
        .select('*')
        .eq('id', userId);

      if (error) {
        console.error(error);
      } else {
        setModelTokens(data[0].model_tokens);

        setUser(data);
      }
    };

    fetchModels();
    fetchUser();
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-screen-lg mx-auto px-8">
        <h2 className="text-4xl font-bold mb-4">Modelos 🤖</h2>

        {models ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((data: any) => {
              const props = {
                userId: data.user_id as string,
                modelId: data.run_id as string,
                token: data.prompt_token as string,
                status: data.status as string
              };
              return <ModelCard props={props} key={data.run_id} />;
            })}
            <div className="rounded-lg  dark:shadow-slate-300 hover:shadow-xl border border-black dark:border-white transition-all ease-in-out duration-75 hover:scale-[1.03] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
              <button className=" w-full h-full py-6">
                <span className="font-bold text-xl mb-2">
                  {modelTokens} tokens para entrenar
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-40 m-auto mt-24">
            <PulseLoader color="#B6B6B6" />
          </div>
        )}
      </div>
    </div>
  );
}
