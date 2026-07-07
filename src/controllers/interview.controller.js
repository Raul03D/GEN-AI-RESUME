const { PDFParse } = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model");
const { selfDescription, jobDescription } = require("../services/temp");



async function generateInterviewReportController(req, res){
    try {
        let resumeText = "";
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer });
            const resumeContent = await parser.getText();
            resumeText = resumeContent.text || "";
        }
        
        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        if (!interviewReportByAi) {
            return res.status(500).json({
                message: "Failed to generate interview report from AI service"
            });
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully", 
            interviewReport
        });
    } catch (error) {
        console.error("Error in generateInterviewReportController:", error);
        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
}

async function getInterviewReportByIdController(req,res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId,user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    res.status(200).json({
        message:"Interview report fetched sucessfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res) {
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message:"Interview reports fetched sucessfully",
        interviewReports
    })

}

async function generateResumePdfController(req,res) {
    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found."
        })
    }

    const {resume,jobDescription,selfDescription,} = interviewReport
    const pdfBuffer = await generateResumePdf({resume,jobDescription,selfDescription})

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`,
        'Content-Length': pdfBuffer.length
    })
    res.send(pdfBuffer);
}

module.exports = {generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController,generateResumePdfController}