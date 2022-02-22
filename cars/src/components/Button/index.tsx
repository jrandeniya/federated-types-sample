import { useState } from "react";
import "./Button.css";

interface IButtonProps {
  consumer: string;
}

export default function Button({ consumer }: IButtonProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-2 p-4 my-2 text-lg font-bold text-center text-gray-800 bg-white rounded-lg">
      Hello, {consumer} from Cars
      <button
        // eslint-disable-next-line max-len
        className="flex items-center justify-center p-4 mr-2 text-xl font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setCount(count + 1)}
      >
        {count} {count === 1 ? "like" : "likes"}
      </button>
    </div>
  );
}
