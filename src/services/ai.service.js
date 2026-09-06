const {GoogleGenAI} = require("@google/genai")
const {z} =require("zod");
const puppeteer = require("puppeteer");

const ai=new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})



const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    technicalQuestions:z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention:z.string().describe("The intention of the interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions:z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention:z.string().describe("The intention of the interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps:z.array(z.object({
        skill:z.string().describe("The skill which the candidate is lacking"),
        severity:z.enum(["low","medium","high"]).describe("The severity of skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan:z.array(z.object({
        day:z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

    title:z.string().describe("The title of the job for which the interview report is generated"),
    
})

async function generateInterviewReport({ resume,selfDescription,jobDescription }){
    try {
        const prompt=`Generate an interview report for a candidate with the following details:
                            Resume: ${resume}
                            Self Description: ${selfDescription}
                            Job Description: ${jobDescription}

                      Instructions for the preparationPlan:
                      - Analyze the self description, job description, and resume to see if the user has requested a specific preparation duration or number of days (e.g., "7 days", "14 days", "30 days", "2 weeks", etc.).
                      - If a specific duration or number of days is requested, generate a preparation plan containing exactly that number of days.
                      - If no specific duration or number of days is requested, default to generating a 7-day preparation plan.
                      - Do not shorten the plan to 3 days if more days were requested or if defaulting.
        `                    

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: z.toJSONSchema(interviewReportSchema),
            }
        })

        return JSON.parse(response.text);
    } catch (error) {
        if (error.status === 429 || (error.message && error.message.includes("429"))) {
            console.error("\n⚠️  Gemini API Rate Limit Exceeded (5 requests per minute limit on Free Tier).");
            console.error("Nodemon restarts the server and calls this API at startup every time you save a file.");
            console.error("Please wait a minute, or comment out the `generateInterviewReport` call in `BACKEND/server.js` while actively developing to preserve your quota.\n");
        } else {
            console.error("Error generating interview report:", error.message || error);
        }
        return null;
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px"
        }
    });
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({resume,selfDescription,jobDescription}){

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to a PDF file"),
    })

    const prompt = `Generate a resume for a candidate with the following details:

        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        the response should be a valid JSON object with a single key "html" containing the HTML content of the resume which can be converted to a PDF file. The HTML should be well-structured and formatted, and should include sections for the candidate's name, contact information, summary, skills, experience, education, and any other relevant information. The HTML should be styled using inline CSS or embedded styles to ensure that it looks professional and is easy to read when converted to a PDF file.
        The resume should be tailored to the job description provided, highlighting the candidate's relevant skills and experience. The resume should be concise and focused, ideally fitting on one page, but can extend to two pages if necessary. The HTML should be valid and well-formed, and should not contain any external dependencies or references to external stylesheets or scripts.
        The content of resume should be not sound like it's generated by AI, it should be natural and human-like. The resume should be optimized for Applicant Tracking Systems (ATS) by using relevant keywords from the job description and avoiding complex formatting or graphics that may not be parsed correctly by ATS software.
        You can highlight the content using some colors or different font styles, but make sure it looks professional and not too flashy. The resume should be visually appealing and easy to read, with clear headings and sections, and should use a consistent font and color scheme throughout. The HTML should be responsive and mobile-friendly, ensuring that it displays correctly on different devices and screen sizes.
        The content should be  ATS friendly,i.e. it should be easily readable by Applicant Tracking Systems (ATS) and should not contain any complex formatting or graphics that may not be parsed correctly by ATS software. The HTML should be structured in a way that allows ATS software to easily extract relevant information such as the candidate's name, contact information, skills, experience, and education.
        The resume should not be so lengthy, it should be concise and focused, ideally fitting on one page, but can extend to two pages if necessary. The HTML should be well-structured and formatted, with clear headings and sections, and should use a consistent font and color scheme throughout. The content of the resume should be tailored to the job description provided, highlighting the candidate's relevant skills and experience, and should be optimized for ATS by using relevant keywords from the job description.
                 
        `    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;

}


module.exports={generateInterviewReport,generateResumePdf}