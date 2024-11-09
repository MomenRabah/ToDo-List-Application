import React from 'react';
import Todo from '../components/Todo';

function OngoingTasks({user}) {
  return (
    
        <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col  rounded-xl'>
            <Todo showCompleted={false} user={user} />
        </div>
  );
}

export default OngoingTasks;
