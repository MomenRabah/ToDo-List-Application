import React from 'react';
import { useQuery } from 'react-query';
import supabase from '../config/supabaseClient';



function Dashboard({user}) {
    const fetchTodoCounts = async (user) => {
        console.log('User ID:', user.id);
        const { count: ongoingCount, error: ongoingError } = await supabase
          .from('ToDoList')
          .select('*', { count: 'exact', head: true })
          .eq('isComplete', false)
          .eq('userID', user.id); 
      
        const { count: completedCount, error: completedError } = await supabase
          .from('ToDoList')
          .select('*', { count: 'exact', head: true })
          .eq('isComplete', true)
          .eq('userID', user.id); 
      
       
        if (ongoingError || completedError) {
          throw new Error('Error fetching task counts');
        }
      
        return {
          ongoingCount,
          completedCount,
        };
      };
      const { data, error, isLoading } = useQuery(['tasksCounts', user.id], () => fetchTodoCounts(user));

    if (isLoading) return <p>Loading...</p>;  
    if (error) return <p>Error fetching counts: {error.message}</p>;

    return (
        <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 h-full rounded-xl'>
        <p className='text-slate-950 font-bold ml-4 mt-8 text-[19px]'>
            Ongoing tasks: {data?.ongoingCount}
        </p>
        <p className='text-slate-950 font-bold ml-4 my-5 text-[19px]'>
            Completed tasks: {data?.completedCount}
        </p>
        </div>
    );
}

export default Dashboard;
