import React, { useEffect, useRef, useState } from 'react'
import todo_icon from '../assets/todo_icon.png'
import TodoItems from './TodoItems'
import supabase from '../config/supabaseClient';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query'


function Todo({showCompleted , user}) {

const queryClient = useQueryClient();

    const fetchTodoList = async (user)=>{
        const { data: ToDoList, error } = await supabase
        .from('ToDoList')
        .select("*")
        .eq('isComplete', showCompleted)
        .eq('userID', user.id); 
        if (error) {
            throw new Error(error.message);  
        }

        return ToDoList;
    }

    const { isLoading, isError, data: filtredTodo, error } = useQuery(['todos', showCompleted, user.id], () => fetchTodoList(user));

// const [filtredTodo, setFiltredTodo] = useState([]);
// const [fetchError, setFetchError] = useState(null);

// useEffect(() => {
//     const fetchFilteredTodo = async () => {
//         const { data: ToDoList, error } = await supabase
//           .from('ToDoList')
//           .select("*")
//           .eq('isComplete', showCompleted); 
      
//         if (error) {
//             setFetchError('Error fetching the todo list');
//             console.error('Error fetching filtered todo list:', error);
//             return;
//         }
      
//         if (ToDoList) {
//           setFiltredTodo(ToDoList);
//         }
//       };
      
//     fetchFilteredTodo();

//         const todoSubscription = supabase
//         .channel('realtime:ToDoList')
//         .on('postgres_changes', { event: '*', schema: 'public', table: 'ToDoList' }, (payload) => {
//             console.log('Change received:', payload);
//             handleRealtimeChange(payload);
//         })
//         .subscribe();

//     return () => {
//         supabase.removeChannel(todoSubscription);
//     };

// }, [showCompleted]);

// const handleRealtimeChange = (payload) => {
//     const { eventType, new: newTodo, old: oldTodo } = payload;

//     if (eventType === 'INSERT' && newTodo.isComplete === showCompleted) {
//         setFiltredTodo((prevTodos) => [...prevTodos, newTodo]);
//     } else if (eventType === 'UPDATE') {
//         if (newTodo.isComplete === showCompleted) {
//             setFiltredTodo((prevTodos) =>
//                 prevTodos.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
//             );
//         } else {
//             setFiltredTodo((prevTodos) => prevTodos.filter((todo) => todo.id !== newTodo.id));
//         }
//     } else if (eventType === 'DELETE') {
//         setFiltredTodo((prevTodos) => prevTodos.filter((todo) => todo.id !== oldTodo.id));
//     }
// };

const deleteMutation = useMutation(
    async (id)=> {
        const { error } = await supabase
        .from('ToDoList')
        .delete()
        .eq('id', id)
    },
    {
        onSuccess: ()=>{
            queryClient.invalidateQueries(['todos'])
        }
    }
);
const deleteTodo = (id)=>{
    deleteMutation.mutate(id);
}

// const delete = async (id)=> {
//     const { error } = await supabase
//     .from('ToDoList')
//     .delete()
//     .eq('id', id)
// }

const toggleMutation = useMutation(
    async (id)=>{
        const { data: currentData, error: fetchError } = await supabase
        .from('ToDoList')
        .select('isComplete')
        .eq('id', id)
        .single();

        if (fetchError) throw new Error(error.message);

        const newStatus = !currentData.isComplete; 

        const { error } = await supabase
            .from('ToDoList')
            .update({ isComplete: newStatus })
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
    },
    {
        onSuccess: ()=>{
            queryClient.invalidateQueries(['todos'])
        }
    }

); 
const toggleTodo = (id)=>{
    toggleMutation.mutate(id);
};

// const toggleTodoItem = async (id) => {
//     const { data: currentData, error: fetchError } = await supabase
//         .from('ToDoList')
//         .select('isComplete')
//         .eq('id', id)
//         .single();

//     if (fetchError) {
//         console.error("Error fetching current status:", fetchError);
//         return;
//     }

//     const currentStatus = currentData.isComplete;
//     const newStatus = !currentStatus; 

//     const { data, error } = await supabase
//         .from('ToDoList')
//         .update({ isComplete: newStatus })
//         .eq('id', id)
//         .select();

//     if (error) {
//         console.error("Error updating task:", error);
//     } else {
//         console.log("Task updated:", data);
//     }
// };


  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7  rounded-xl'>
{isError && <div className="text-red-500">Error fetching data: {error.message}</div>}
{isLoading && <div className="text-gray-500">Loading tasks...</div>}

    <div>
        {filtredTodo?.map((item) => (
            <TodoItems
                key={item.id}
                text={item.content}
                id={item.id}
                isComplete={item.isComplete}
                deleteTodo={deleteTodo}
                toggle={(id)=>{toggleTodo(id);
                }}
            />
        ))}
    </div>



    </div>
  )
}

export default Todo