
const upgradeStorageTemplate = (name: string, plan: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Storage Upgrade Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
                <img src="https://d3exjxhq0acftn.cloudfront.net/logo.png" alt="Nafri-Logo" style="max-width: 150px; height: auto;">
            </div>
            
            <div style="padding: 30px 20px;">
                <h2 style="color: #2c3e50; margin-top: 0;">Storage Upgrade Confirmation</h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hello ${name},</p>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thank you for upgrading your storage plan. Your account has been successfully updated with the new storage capacity.</p>
                
                <div style="background-color: #f5f8fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">Upgrade Details</h3>
                    <p style="font-size: 16px; margin: 5px 0;"><strong>Plan:</strong> ${plan}</p>
                    <p style="font-size: 16px; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">You can start using your additional storage right away. If you have any questions or need assistance, please contact our support team.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://www.nafri.in/dashboard" style="display: inline-block; background-color: #3498db; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">Access Your Account</a>
                </div>
            </div>
            
            <div style="background-color: #f5f8fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #7f8c8d;">
                <p>© ${new Date().getFullYear()} Nafri. All rights reserved.</p>
                <p>If you did not request this upgrade, please contact us immediately.</p>
            </div>
        </div>
    </body>
    </html>
    `
}

export default upgradeStorageTemplate;

