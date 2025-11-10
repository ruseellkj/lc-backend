"use server";
import axios from "axios";

export const submitProblem = async () => {
    try {
        const response = await axios.post('http://localhost:3000/submit', {
            problemId: "1",
            userId: "1",
            code: "asd",
            language: "cpp"
        });
        console.log('Submission successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Submission failed:', error);
        throw error;
    }
}