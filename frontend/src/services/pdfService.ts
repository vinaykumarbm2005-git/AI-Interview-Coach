import { jsPDF } from 'jspdf';
import { AIReportData, StudentProfile, DomainType } from '../types';

export function downloadPDFReport(report: AIReportData, student: StudentProfile, domain: DomainType) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Primary Colors (White + Professional Green Theme)
  const primaryGreen = '#16a34a';
  const darkGreen = '#14532d';
  const textDark = '#1e293b';
  const bgLight = '#f8fafc';

  // Helper function to check page space and add new page if needed
  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      // Header for secondary pages
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`AI Interview Coach — Performance Report | Candidate: ${student.name}`, margin, 10);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // --- HEADER SECTION ---
  // Top Green Banner Accent
  doc.setFillColor(22, 163, 74); // #16a34a
  doc.rect(0, 0, pageWidth, 6, 'F');

  y += 6;

  // Title & Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 83, 45); // Dark green
  doc.text("AI INTERVIEW COACH", margin, y + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text("AI Interview Evaluation & Readiness Report", margin, y + 14);

  // Date & Report Ref
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(9);
  doc.text(`Date: ${dateStr}`, pageWidth - margin - 40, y + 8);
  doc.text(`Status: Evaluated by AI`, pageWidth - margin - 40, y + 14);

  y += 22;

  // Candidate Info Card
  doc.setFillColor(240, 253, 244); // #f0fdf4
  doc.setDrawColor(187, 247, 208); // #bbf7d0
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text(`Candidate: ${student.name}`, margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`USN: ${student.usn}   |   Branch: ${student.branch}   |   Semester: ${student.semester}`, margin + 5, y + 13);
  doc.text(`Target Domain: ${domain}   |   Word Count: ${report.totalWordCount} words`, margin + 5, y + 19);

  y += 30;

  // Helper for rendering section
  const renderSection = (title: string, content: string, icon = "•") => {
    checkNewPage(25);

    // Section Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(22, 163, 74); // Green header
    doc.text(`${icon} ${title.toUpperCase()}`, margin, y);
    y += 2;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Content lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(content, pageWidth - (margin * 2));
    const textHeight = splitText.length * 4.5;
    checkNewPage(textHeight + 5);

    doc.text(splitText, margin, y);
    y += textHeight + 6;
  };

  // Render all 11 required sections
  renderSection("Overall Interview Summary", report.overallSummary, "📌");
  renderSection("Technical Strengths", report.technicalStrengths, "⚡");
  renderSection("Coding Strengths", report.codingStrengths, "💻");
  renderSection("HR Performance", report.hrPerformance, "🤝");
  renderSection("Strong Areas", report.strongAreas, "🎯");
  renderSection("Weak Areas", report.weakAreas, "⚠️");
  renderSection("Areas for Improvement", report.areasForImprovement, "📈");
  renderSection("Recommended Topics", report.recommendedTopics, "📚");
  renderSection("Learning Roadmap", report.learningRoadmap, "🗺️");
  renderSection("Hiring Readiness", report.hiringReadiness, "🏆");
  renderSection("Professional Conclusion", report.conclusion, "✨");

  // Footer on last page
  checkNewPage(15);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("AI Interview Coach Platform | Certified AI Evaluation", pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save the PDF
  const filename = `AI_Interview_Coach_Report_${student.name.replace(/\s+/g, '_')}_${domain.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
