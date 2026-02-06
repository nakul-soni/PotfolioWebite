import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { name, email, message, service } = body;

        // Validate required fields
        if (!name || !email || !message || !service) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate field lengths
        if (name.length > 100 || message.length > 5000 || service.length > 200) {
            return NextResponse.json(
                { error: 'Field length exceeds maximum' },
                { status: 400 }
            );
        }

        // Check if environment variables are set
        if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
            console.error('Missing environment variables: RESEND_API_KEY or CONTACT_EMAIL');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Send notification email to you
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Quote Request <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL],
            replyTo: email,
            subject: `New Quote Request for ${service}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Quote Request</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 30px; border-radius: 8px 8px 0 0;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">💼 New Quote Request</h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px;">You have received a new quote request from your portfolio website.</p>
                                            
                                            <!-- Service Info -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                                                <tr>
                                                    <td style="padding: 15px; background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); border-radius: 8px;">
                                                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Service Requested:</p>
                                                        <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">${service}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Client Info -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                                <tr>
                                                    <td style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #8b5cf6; border-radius: 4px;">
                                                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px; font-weight: bold;">CLIENT DETAILS:</p>
                                                        <p style="margin: 0 0 5px 0; color: #333333; font-size: 16px; font-weight: 600;">${name}</p>
                                                        <p style="margin: 0; color: #8b5cf6; font-size: 14px;">
                                                            <a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Project Details -->
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                                                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px; font-weight: bold;">PROJECT DETAILS:</p>
                                                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                                This quote request was sent from your portfolio services section.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        // Send auto-reply confirmation email to the requester
        try {
            console.log('Sending quote auto-reply to:', email);
            const autoReplyResult = await resend.emails.send({
                from: 'Nakul Soni <onboarding@resend.dev>',
                to: [email],
                subject: 'Thank you for your quote request!',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Quote Request Received</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                        <!-- Header -->
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Quote Request Received! 🎉</h1>
                                            </td>
                                        </tr>
                                        
                                        <!-- Content -->
                                        <tr>
                                            <td style="padding: 40px 30px;">
                                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                    Hi <strong>${name}</strong>,
                                                </p>
                                                
                                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                    Thank you for your interest in my services! I've received your quote request and I'm excited to learn more about your project.
                                                </p>
                                                
                                                <!-- Service Summary -->
                                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                                    <tr>
                                                        <td style="padding: 20px; background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); border-radius: 8px;">
                                                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Service Requested:</p>
                                                            <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">${service}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <!-- Project Details Summary -->
                                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                                    <tr>
                                                        <td style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #8b5cf6; border-radius: 4px;">
                                                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; font-weight: bold; text-transform: uppercase;">Your Project Details:</p>
                                                            <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                    I'll review your requirements and get back to you with a detailed quote within 24-48 hours.
                                                </p>
                                                
                                                <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                    Looking forward to working with you!<br>
                                                    <strong style="color: #8b5cf6;">Nakul Soni</strong>
                                                </p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Footer -->
                                        <tr>
                                            <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                                                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                                    This is an automated confirmation email.
                                                </p>
                                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                                    Please do not reply to this email. I'll respond to your quote request directly.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });

            if (autoReplyResult.error) {
                console.error('Auto-reply failed with error:', autoReplyResult.error);
            } else {
                console.log('Quote auto-reply sent successfully! ID:', autoReplyResult.data?.id);
            }
        } catch (autoReplyError) {
            console.error('Auto-reply email exception:', autoReplyError);
        }

        return NextResponse.json(
            { success: true, messageId: data?.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('Quote form error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
