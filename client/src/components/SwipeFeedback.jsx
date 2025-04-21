import { useMatchStore } from "../store/useMatchStore";

const getFeedbackStyle = (SwipeFeedback) => {
  if (SwipeFeedback === "liked") return "text-green-500";
  if (SwipeFeedback === "passed") return "text-red-500";
  if (SwipeFeedback === "matched") return "text-pink-500";
  return "";
};

const getFeedbackText = (SwipeFeedback) => {
  if (SwipeFeedback === "liked") return "Liked";
  if (SwipeFeedback === "passed") return "Passed";
  if (SwipeFeedback === "matched") return "its a Match";
  return "";
};

const SwipeFeedback = () => {
  const { swipeFeedback } = useMatchStore();
  return (
    <div
      className={`absolute top-10 left-0 right-0 text-center text-2xl font-bold 
    ${getFeedbackStyle(swipeFeedback)}`}
    >
      {getFeedbackText(swipeFeedback)}
    </div>
  );
};

export default SwipeFeedback;
