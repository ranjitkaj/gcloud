import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srinathballa20@gmail.com', // Your email
    pass: 'veouuoapolixrlqa'         // Your app password
  }
});

// Email templates
const emailTemplates = {
  contactForm: (data: any) => ({
    subject: `Contact Form Submission: ${data.subject || 'New Message'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject || 'Not provided'}</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This message was sent from the contact form on your real estate website.</p>
      </div>
    `
  }),
  
  feedbackForm: (data: any) => ({
    subject: `Website Feedback: ${data.category || 'General Feedback'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - User Feedback</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Category:</strong> ${data.category || 'Not categorized'}</p>
        <p><strong>Rating:</strong> ${data.rating}/5</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Feedback:</strong></p>
          <p>${data.feedback}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This feedback was submitted from your real estate website.</p>
      </div>
    `
  }),
  
  reportProblem: (data: any) => ({
    subject: `Problem Report: ${data.category || 'Website Issue'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Problem Report</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Category:</strong> ${data.category || 'Uncategorized'}</p>
        <p><strong>Severity:</strong> ${data.severity || 'Not specified'}</p>
        <p><strong>URL:</strong> ${data.url || 'Not provided'}</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Description:</strong></p>
          <p>${data.description}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This problem was reported from your real estate website.</p>
      </div>
    `
  }),
  
  propertyInterest: (data: any) => ({
    subject: `Property Interest: ${data.propertyTitle || 'Property Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Property Interest</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <div style="margin: 15px 0; padding: 10px; border-left: 4px solid #4a6ee0;">
          <p><strong>Property:</strong> ${data.propertyTitle || 'Not specified'}</p>
          <p><strong>Property ID:</strong> ${data.propertyId || 'Not specified'}</p>
          <p><strong>Price:</strong> ${data.propertyPrice || 'Not specified'}</p>
          <p><strong>Location:</strong> ${data.propertyLocation || 'Not specified'}</p>
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This interest was submitted from your real estate website.</p>
      </div>
    `
  })
};

// Generic function to send an email
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const mailOptions = {
      from: '"Real Estate Platform" <srinathballa20@gmail.com>',
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Contact form submission handler
export async function handleContactForm(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }
    
    const template = emailTemplates.contactForm({ name, email, phone, subject, message });
    await sendEmail('srinathballa20@gmail.com', template.subject, template.html);
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send your message. Please try again later.' 
    });
  }
}

// Feedback form submission handler
export async function handleFeedbackForm(req: Request, res: Response) {
  try {
    const { name, email, category, rating, feedback } = req.body;
    
    if (!name || !email || !feedback) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and feedback are required' 
      });
    }
    
    const template = emailTemplates.feedbackForm({ name, email, category, rating, feedback });
    await sendEmail('srinathballa20@gmail.com', template.subject, template.html);
    
    res.json({ 
      success: true, 
      message: 'Your feedback has been submitted successfully' 
    });
  } catch (error) {
    console.error('Feedback form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit your feedback. Please try again later.' 
    });
  }
}

// Report problem form submission handler
export async function handleReportProblem(req: Request, res: Response) {
  try {
    const { name, email, category, severity, url, description } = req.body;
    
    if (!name || !email || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and description are required' 
      });
    }
    
    const template = emailTemplates.reportProblem({ 
      name, email, category, severity, url, description 
    });
    await sendEmail('srinathballa20@gmail.com', template.subject, template.html);
    
    res.json({ 
      success: true, 
      message: 'Your report has been submitted successfully' 
    });
  } catch (error) {
    console.error('Report problem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit your report. Please try again later.' 
    });
  }
}

// Property interest form submission handler
export async function handlePropertyInterest(req: Request, res: Response) {
  try {
    const { 
      name, email, phone, message, 
      propertyId, propertyTitle, propertyPrice, propertyLocation 
    } = req.body;
    
    if (!name || !email || !propertyId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and property details are required' 
      });
    }
    
    const template = emailTemplates.propertyInterest({ 
      name, email, phone, message, 
      propertyId, propertyTitle, propertyPrice, propertyLocation 
    });
    await sendEmail('srinathballa20@gmail.com', template.subject, template.html);
    
    res.json({ 
      success: true, 
      message: 'Your interest has been submitted successfully' 
    });
  } catch (error) {
    console.error('Property interest error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit your interest. Please try again later.' 
    });
  }
}