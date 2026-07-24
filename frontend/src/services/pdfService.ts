import { jsPDF } from 'jspdf';
import { AIReportData, StudentProfile, DomainType } from '../types';

export function downloadPDFReport(report: AIReportData, student: StudentProfile, domain: DomainType) {
  const activeRounds = report.completedRounds || [];
  if (activeRounds.length === 0 || !report.hasSufficientResponses) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Helper for page overflow
  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`AI Interview Coach — Performance Report | Candidate: ${student.name}`, margin, 10);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // --- HEADER SECTION ---
  doc.setFillColor(22, 163, 74); // #16a34a
  doc.rect(0, 0, pageWidth, 6, 'F');
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 83, 45);
  doc.text("AI INTERVIEW COACH", margin, y + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text("AI Evaluation & Performance Report", margin, y + 14);

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(9);
  doc.text(`Date: ${dateStr}`, pageWidth - margin - 40, y + 8);
  doc.text(`Completed Rounds: ${activeRounds.map(r => r.toUpperCase()).join(', ')}`, pageWidth - margin - 40, y + 14);

  y += 22;

  // Candidate Info Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text(`Candidate: ${student.name}`, margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`USN: ${student.usn}   |   Branch: ${student.branch}   |   Semester: ${student.semester}`, margin + 5, y + 13);
  doc.text(`Target Domain: ${domain}   |   Answered: ${report.answeredCount}   |   Skipped: ${report.skippedCount}`, margin + 5, y + 19);

  y += 32;

  const renderSection = (title: string, content?: string, icon = "•") => {
    if (!content || !content.trim()) return;
    checkNewPage(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(22, 163, 74);
    doc.text(`${icon} ${title.toUpperCase()}`, margin, y);
    y += 2;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(content, pageWidth - (margin * 2));
    const textHeight = splitText.length * 4.5;
    checkNewPage(textHeight + 5);

    doc.text(splitText, margin, y);
    y += textHeight + 6;
  };

  // 1. Overall Summary
  renderSection("Overall Interview Summary", report.overallSummary, "📌");

  // 2. Technical Round Sections (ONLY if Technical was completed)
  if (activeRounds.includes('technical')) {
    renderSection("Technical Summary", report.technicalSummary, "⚡");
    renderSection("Technical Strengths", report.technicalStrengths, "⚡");
    renderSection("Technical Weaknesses", report.technicalWeaknesses, "⚡");
    renderSection("Technical Recommendations", report.technicalRecommendations, "⚡");
  }

  // 3. Coding Round Sections (ONLY if Coding was completed)
  if (activeRounds.includes('coding')) {
    renderSection("Coding Summary", report.codingSummary, "💻");
    renderSection("Coding Strengths", report.codingStrengths, "💻");
    renderSection("Coding Weaknesses", report.codingWeaknesses, "💻");
    renderSection("Coding Recommendations", report.codingRecommendations, "💻");
  }

  // 4. HR Round Sections (ONLY if HR was completed)
  if (activeRounds.includes('hr')) {
    renderSection("HR Summary", report.hrSummary, "🤝");
    renderSection("HR Strengths", report.hrStrengths, "🤝");
    renderSection("HR Weaknesses", report.hrWeaknesses, "🤝");
    renderSection("HR Recommendations", report.hrRecommendations, "🤝");
  }

  // 5. General Strengths / Weaknesses / Roadmap
  renderSection("Key Strengths", report.strongAreas, "🎯");
  renderSection("Identified Weaknesses", report.weakAreas, "⚠️");
  renderSection("Areas for Improvement", report.areasForImprovement, "📈");
  renderSection("Recommended Topics", report.recommendedTopics, "📚");
  renderSection("Learning Roadmap", report.learningRoadmap, "🗺️");
  renderSection("Hiring Readiness", report.hiringReadiness, "🏆");
  renderSection("Professional Conclusion", report.conclusion, "✨");

  // Footer on last page
  checkNewPage(15);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("AI Interview Coach Platform | Certified Answered-Only AI Evaluation", pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save PDF
  const filename = `AI_Interview_Coach_Report_${student.name.replace(/\s+/g, '_')}_${domain.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
