<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PolicyController extends Controller
{
    private function getPolicies()
    {
        return [
            'privacy-policy' => [
                'title' => 'Privacy Policy',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Introduction',
                        'content' => '<p>Avhira (“Company”, “we”, “our”, or “us”) is committed to respecting and protecting the privacy of every individual who interacts with our website https://avhira.com (“Website”). This Privacy Policy explains what personal data we collect, why we collect it, how we use and protect it, and what rights you have over your information.</p><p>By accessing the Website or placing an order, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Website immediately.</p>'
                    ],
                    [
                        'title' => '2. Information We Collect',
                        'content' => '<p>We may collect the following categories of personal information:</p><ul><li><strong>Identity & Contact Data:</strong> Full name, email address, mobile number, date of birth (if provided).</li><li><strong>Address Data:</strong> Shipping address, billing address, city, state, PIN code.</li><li><strong>Transaction & Order Data:</strong> Order history, items purchased, payment status, invoices, and refund records.</li><li><strong>Payment Information:</strong> Payment method type, masked card details (last 4 digits), UPI ID (partially masked). We do not store complete card numbers, CVV, UPI PINs, or net banking credentials.</li><li><strong>Technical Data:</strong> IP address, device type, operating system, browser type and version, referral URLs, and session data.</li><li><strong>Usage Data:</strong> Pages visited, time spent, products viewed, search queries within the Website, and click patterns.</li><li><strong>Communication Data:</strong> Customer support emails, chat logs, feedback, and survey responses.</li><li><strong>Marketing Preferences:</strong> Consent status for promotional communications via email, SMS, or WhatsApp.</li></ul>'
                    ],
                    [
                        'title' => '3. Legal Basis and Purpose of Processing',
                        'content' => '<p>We process your personal data under the following legal bases:</p><ul><li><strong>Contractual Necessity:</strong> To process and fulfil your orders, arrange shipping, handle returns, and respond to queries.</li><li><strong>Legal Obligation:</strong> To comply with applicable laws including GST compliance, consumer protection regulations, and court or regulatory orders.</li><li><strong>Legitimate Interest:</strong> To detect fraud, prevent misuse, improve Website functionality, and conduct analytics to enhance user experience.</li><li><strong>Consent:</strong> To send you promotional communications, personalized offers, and marketing campaigns — only where you have provided explicit consent.</li></ul>'
                    ],
                    [
                        'title' => '4. Payment Security',
                        'content' => '<p>All payment transactions are processed through PCI-DSS compliant third-party payment gateways. Avhira does not store or have access to complete card numbers, CVV codes, UPI PINs, or internet banking credentials. Payments are encrypted in transit using industry-standard SSL/TLS encryption. Any suspected unauthorized transaction must be reported to us immediately at avhirahouse@gmail.com.</p>'
                    ],
                    [
                        'title' => '5. Third-Party Data Sharing',
                        'content' => '<p>We may share your personal information with the following categories of recipients only to the extent necessary:</p><ul><li><strong>Logistics & Courier Partners:</strong> For order dispatch, tracking, and delivery.</li><li><strong>Payment Processors:</strong> For payment authorization, settlement, and fraud prevention.</li><li><strong>IT & Cloud Service Providers:</strong> For website hosting, database management, and technical operations.</li><li><strong>Marketing & Analytics Partners:</strong> For email campaigns, ad retargeting, and website analytics (e.g., Google Analytics, Meta Pixel) — governed by their respective privacy policies.</li><li><strong>Legal & Regulatory Authorities:</strong> When required by law, court order, or regulatory mandate.</li></ul><p>We do not sell, rent, or trade your personal data to third parties for their independent commercial use.</p>'
                    ],
                    [
                        'title' => '6. Data Retention',
                        'content' => '<p>We retain personal data for as long as necessary to fulfil the purposes outlined in this Policy, or as required by applicable Indian law. Typically:</p><ul><li>Order and transaction records: 7 years (for GST, accounting, and legal compliance).</li><li>Customer support records: 3 years from date of interaction.</li><li>Marketing consent records: Until consent is withdrawn, plus 1 year.</li><li>Technical logs: 90 days to 1 year depending on operational need.</li></ul>'
                    ],
                    [
                        'title' => '7. Your Rights',
                        'content' => '<p>Subject to applicable law, you have the right to access, correct, erase, withdraw consent, request data portability, and lodge grievances. To exercise any right, email <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a> with the subject line “Data Privacy Request” and your registered contact details.</p>'
                    ],
                    [
                        'title' => '8. Data Security',
                        'content' => '<p>Avhira implements commercially reasonable technical and organizational security measures including SSL/TLS encryption, access controls, periodic security reviews, and secure data storage. No electronic transmission is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.</p>'
                    ],
                    [
                        'title' => '9. Children’s Privacy',
                        'content' => '<p>The Website is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. Parents or guardians who believe their child has submitted information may contact <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a>.</p>'
                    ],
                    [
                        'title' => '10. Cross-Border Data Transfers',
                        'content' => '<p>Your personal data is primarily stored and processed within India. Where data is processed or transferred outside India (e.g., by international cloud providers or analytics tools), we ensure adequate safeguards are in place as required under applicable Indian data protection law.</p>'
                    ],
                    [
                        'title' => '11. Policy Updates',
                        'content' => '<p>We reserve the right to update this Privacy Policy at any time. Significant changes will be communicated via email or a prominent notice on the Website. Continued use after notification constitutes acceptance of the revised Policy.</p>'
                    ]
                ]
            ],
            'terms-and-conditions' => [
                'title' => 'Terms & Conditions',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Acceptance of Terms',
                        'content' => '<p>By accessing, browsing, or transacting on the Website, you confirm that you have read, understood, and unconditionally accept these Terms along with all other policies published on the Website, which are incorporated herein by reference.</p>'
                    ],
                    [
                        'title' => '2. Eligibility',
                        'content' => '<p>Use of this Website is restricted to individuals who: (a) are at least 18 years of age; (b) are legally competent to enter into binding contracts under the Indian Contract Act, 1872; and (c) are not barred from receiving services under applicable law.</p>'
                    ],
                    [
                        'title' => '3. Products & Availability',
                        'content' => '<p>All products displayed on the Website are subject to availability and may be withdrawn, modified, or discontinued without prior notice. Product images are illustrative and may differ from the actual product due to photographic rendering, screen calibration, and handcrafted variations. Such differences shall not constitute a defect or ground for return unless covered under the Return Policy.</p>'
                    ],
                    [
                        'title' => '4. Pricing & Taxes',
                        'content' => '<p>All prices are in Indian Rupees (INR) and inclusive of applicable GST unless otherwise stated. Avhira reserves the right to revise prices at any time. In the event of a pricing error, we reserve the right to cancel affected orders and issue a full refund. A valid GST invoice shall be issued for every purchase.</p>'
                    ],
                    [
                        'title' => '5. Order Acceptance & Contract Formation',
                        'content' => '<p>Placing an order constitutes an offer to purchase, not a binding contract. A binding contract is formed only when Avhira processes and dispatches the order. Avhira reserves the right to reject or cancel any order due to stock issues, pricing errors, failed payment authorization, suspected fraud, or delivery infeasibility.</p>'
                    ],
                    [
                        'title' => '6. User Accounts',
                        'content' => '<p>You are responsible for maintaining the confidentiality of your account credentials and all activities occurring under your account. Notify us immediately of any unauthorized access at <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a>.</p>'
                    ],
                    [
                        'title' => '7. Prohibited Conduct',
                        'content' => '<p>You agree not to: use the Website for unlawful or fraudulent purposes; transmit malware or harmful code; attempt unauthorized access to systems; scrape or data-mine the Website; misuse promotional offers; engage in abusive conduct; or violate intellectual property rights.</p>'
                    ],
                    [
                        'title' => '8. Intellectual Property Rights',
                        'content' => '<p>All Website content including brand name, logo, trademarks, designs, photographs, videos, and written content are the exclusive intellectual property of Avhira, protected under the Trade Marks Act, 1999, Copyright Act, 1957, Designs Act, 2000, and other applicable laws. No part may be reproduced or used commercially without prior written authorization.</p>'
                    ],
                    [
                        'title' => '9. User-Generated Content',
                        'content' => '<p>By submitting reviews, ratings, photographs, or other content, you grant Avhira a non-exclusive, royalty-free, perpetual, worldwide license to use, reproduce, modify, display, and distribute such content for business and promotional purposes. Avhira reserves the right to moderate or remove any content at its discretion.</p>'
                    ],
                    [
                        'title' => '10. Limitation of Liability',
                        'content' => '<p>To the fullest extent permitted under Indian law, Avhira shall not be liable for any indirect, incidental, special, punitive, or consequential damages. Avhira’s maximum liability for any claim shall be limited to the purchase price paid for the specific order giving rise to the claim.</p>'
                    ],
                    [
                        'title' => '11. Third-Party Links',
                        'content' => '<p>The Website may contain links to third-party websites. Avhira does not endorse or assume responsibility for third-party content, privacy practices, or reliability. Use of third-party websites is at your own risk.</p>'
                    ],
                    [
                        'title' => '12. Force Majeure',
                        'content' => '<p>Avhira shall not be liable for delays or failures caused by events beyond its reasonable control, including natural disasters, epidemics, pandemics, governmental restrictions, cyberattacks, strikes, or transportation disruptions.</p>'
                    ],
                    [
                        'title' => '13. Disclaimer of Warranties',
                        'content' => '<p>The Website and its content are provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or uninterrupted availability.</p>'
                    ],
                    [
                        'title' => '14. Dispute Resolution & Governing Law',
                        'content' => '<p>Disputes shall first be attempted to be resolved amicably within 30 days of notice. If unresolved, disputes shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996, before a sole arbitrator mutually appointed, with the seat of arbitration at Ahmedabad, Gujarat, India. Proceedings shall be in English. All matters are governed by Indian law, subject to the exclusive jurisdiction of courts at Ahmedabad, Gujarat.</p>'
                    ]
                ]
            ],
            'shipping-policy' => [
                'title' => 'Shipping Policy',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Order Processing',
                        'content' => '<p>Orders are typically processed within 1–3 business days after successful payment confirmation. During peak sale periods, processing may extend to 5 business days.</p>'
                    ],
                    [
                        'title' => '2. Estimated Delivery Timelines',
                        'content' => '<table class="table-auto w-full text-left border-collapse border border-gray-200"><thead><tr class="bg-gray-100"><th class="border border-gray-200 p-2">Destination</th><th class="border border-gray-200 p-2">Estimated Delivery</th></tr></thead><tbody><tr><td class="border border-gray-200 p-2">Metro Cities</td><td class="border border-gray-200 p-2">3–5 business days</td></tr><tr><td class="border border-gray-200 p-2">Tier-2 & Tier-3 Cities</td><td class="border border-gray-200 p-2">5–7 business days</td></tr><tr><td class="border border-gray-200 p-2">Remote / Rural Areas</td><td class="border border-gray-200 p-2">7–10 business days</td></tr><tr><td class="border border-gray-200 p-2">North-East India & J&K</td><td class="border border-gray-200 p-2">8–12 business days</td></tr></tbody></table><p class="mt-4">Delivery timelines are estimates and not guarantees. Avhira shall not be liable for delays caused by courier partners, weather, natural disasters, regional lockdowns, or other unforeseen events.</p>'
                    ],
                    [
                        'title' => '3. Shipping Charges',
                        'content' => '<p>Applicable shipping charges (if any) are calculated based on order value, weight, and delivery location, and will be displayed at checkout before payment.</p>'
                    ],
                    [
                        'title' => '4. Order Tracking',
                        'content' => '<p>Once dispatched, tracking information including courier partner name and tracking ID will be sent to your registered email, mobile number, or WhatsApp.</p>'
                    ],
                    [
                        'title' => '5. Address Accuracy & Customer Responsibility',
                        'content' => '<p>You are solely responsible for providing a complete, accurate, and accessible delivery address. Avhira shall not be responsible for non-delivery or re-dispatch costs arising from an incorrect or incomplete address.</p>'
                    ],
                    [
                        'title' => '6. Partial Shipments',
                        'content' => '<p>Orders with multiple products may be dispatched in separate shipments based on stock availability. Separate tracking information will be provided for each shipment at no additional charge.</p>'
                    ],
                    [
                        'title' => '7. Unserviceable Pin Codes',
                        'content' => '<p>Certain pin codes may be temporarily or permanently non-serviceable. In such cases you will be informed, and a full refund will be initiated for prepaid orders if an alternative arrangement cannot be made.</p>'
                    ],
                    [
                        'title' => '8. Failed Delivery Attempts',
                        'content' => '<p>If delivery repeatedly fails due to customer unavailability or refusal, the order may be returned to origin (RTO). Re-delivery charges will apply and refunds (if any) will be processed after deducting applicable shipping and RTO handling fees.</p>'
                    ],
                    [
                        'title' => '9. Damaged in Transit',
                        'content' => '<p>If your package appears tampered with or damaged at delivery, please refuse acceptance and report within 24 hours to <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a> with photographs of the packaging and product.</p>'
                    ]
                ]
            ],
            'return-refund-exchange' => [
                'title' => 'Return, Refund & Exchange Policy',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Return Window & Eligibility',
                        'content' => '<p>Return requests must be initiated within 7 (seven) calendar days from the date of delivery. The product must be: unused, unwashed, and unaltered; have all original tags, labels, and barcodes intact; be in its original packaging with invoice; and not fall under the non-returnable category.</p>'
                    ],
                    [
                        'title' => '2. Exchange Eligibility',
                        'content' => '<p>Exchanges for a different size or colour are subject to stock availability and must be initiated within 7 calendar days of delivery. If the desired size or colour is unavailable, a store credit or refund may be offered at Avhira’s discretion.</p>'
                    ],
                    [
                        'title' => '3. Refund Process & Timelines',
                        'content' => '<table class="table-auto w-full text-left border-collapse border border-gray-200"><thead><tr class="bg-gray-100"><th class="border border-gray-200 p-2">Payment Mode</th><th class="border border-gray-200 p-2">Refund Timeline</th></tr></thead><tbody><tr><td class="border border-gray-200 p-2">Credit / Debit Card</td><td class="border border-gray-200 p-2">7–10 business days after approval</td></tr><tr><td class="border border-gray-200 p-2">UPI / Net Banking</td><td class="border border-gray-200 p-2">5–7 business days after approval</td></tr><tr><td class="border border-gray-200 p-2">Wallet / EMI</td><td class="border border-gray-200 p-2">Per payment gateway timelines</td></tr><tr><td class="border border-gray-200 p-2">Cash on Delivery (COD)</td><td class="border border-gray-200 p-2">Bank transfer within 7–10 business days</td></tr><tr><td class="border border-gray-200 p-2">Store Credit / Gift Card</td><td class="border border-gray-200 p-2">Within 24–48 hours of approval</td></tr></tbody></table>'
                    ],
                    [
                        'title' => '4. Reporting Damaged, Defective, or Incorrect Products',
                        'content' => '<p>Report damaged, defective, or incorrect products within 48 hours of delivery by emailing <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a> with your order number, clear photographs or video of the issue. Claims beyond 48 hours may not be accepted.</p>'
                    ],
                    [
                        'title' => '5. Non-Returnable & Non-Refundable Products',
                        'content' => '<ul class="list-disc pl-5"><li>Customized, personalized, or made-to-order products.</li><li>Innerwear, intimate apparel, and hygiene-sensitive items.</li><li>Accessories including jewellery, scarves, hair accessories, and belts.</li><li>Products marked as “Final Sale”, “Clearance”, or “Non-Returnable” on the product page.</li><li>Gift cards, vouchers, and store credits.</li></ul>'
                    ],
                    [
                        'title' => '6. Condition-Based Rejection',
                        'content' => '<p>Returns may be rejected if the product shows signs of use or washing; has stains, perfume, deodorant, or makeup marks; has missing or damaged tags; or has been altered after delivery. Rejected returns will be reshipped at the customer’s cost.</p>'
                    ],
                    [
                        'title' => '7. Reverse Pickup & Self-Shipment',
                        'content' => '<p>Reverse pickup is available at select pin codes. Where unavailable, customers must self-ship to our designated warehouse address (provided upon return approval) using a trackable courier. Avhira will not be responsible for products lost during self-shipment.</p>'
                    ],
                    [
                        'title' => '8. Non-Refundable Charges',
                        'content' => '<p>Forward shipping charges, COD convenience fees, gift-wrapping charges, and reverse pickup handling fees are generally non-refundable unless the return is due to Avhira’s error.</p>'
                    ]
                ]
            ],
            'cancellation-policy' => [
                'title' => 'Cancellation Policy',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Cancellation by Customer',
                        'content' => '<p>Orders may be cancelled before dispatch by contacting <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a> or calling +91-9157903173 with your order number. Once dispatched, orders cannot be cancelled; customers may initiate a return post-delivery per Section 4.</p>'
                    ],
                    [
                        'title' => '2. Refunds for Customer-Initiated Cancellations',
                        'content' => '<p>For prepaid orders cancelled before dispatch, a full refund will be initiated to the original payment method within 5–7 business days. No refund is applicable for COD orders cancelled before dispatch as no payment has been made.</p>'
                    ],
                    [
                        'title' => '3. Cancellation by Avhira',
                        'content' => '<p>Avhira may cancel orders due to: product out of stock or discontinuation; pricing or description errors; failed payment authorization; suspected fraudulent activity; non-serviceable delivery location; or misuse of promotional offers. In all such cases, a full refund will be issued for any amount paid.</p>'
                    ],
                    [
                        'title' => '4. Repeated Cancellations & COD Restrictions',
                        'content' => '<p>Customers with a pattern of repeated cancellations, unaccepted COD deliveries, or return-to-origin incidents may have their COD facility restricted or accounts placed under review at Avhira’s discretion.</p>'
                    ]
                ]
            ],
            'cookie-policy' => [
                'title' => 'Cookie Policy',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. What are Cookies?',
                        'content' => '<p>Cookies are small text files placed on your device when you visit a website. They allow the Website to recognize your device, remember your preferences, and provide a personalized browsing experience.</p>'
                    ],
                    [
                        'title' => '2. Types of Cookies We Use',
                        'content' => '<table class="table-auto w-full text-left border-collapse border border-gray-200"><thead><tr class="bg-gray-100"><th class="border border-gray-200 p-2">Cookie Type</th><th class="border border-gray-200 p-2">Purpose</th></tr></thead><tbody><tr><td class="border border-gray-200 p-2">Essential / Strictly Necessary</td><td class="border border-gray-200 p-2">Required for core functionality (sessions, cart, checkout). Cannot be disabled.</td></tr><tr><td class="border border-gray-200 p-2">Performance / Analytics</td><td class="border border-gray-200 p-2">Collect anonymized data on usage (e.g., Google Analytics).</td></tr><tr><td class="border border-gray-200 p-2">Functionality / Preference</td><td class="border border-gray-200 p-2">Remember language, region, and saved cart items.</td></tr><tr><td class="border border-gray-200 p-2">Marketing / Advertising</td><td class="border border-gray-200 p-2">Track activity to deliver targeted ads via Google Ads, Meta, etc.</td></tr><tr><td class="border border-gray-200 p-2">Session Cookies</td><td class="border border-gray-200 p-2">Temporary; expire when the browser is closed.</td></tr><tr><td class="border border-gray-200 p-2">Persistent Cookies</td><td class="border border-gray-200 p-2">Remain for a specified period to remember preferences across visits.</td></tr></tbody></table>'
                    ],
                    [
                        'title' => '3. Cookie Consent',
                        'content' => '<p>On your first visit, a Cookie Consent Banner will allow you to accept all cookies, accept only essential cookies, or customize your preferences.</p>'
                    ],
                    [
                        'title' => '4. Managing & Disabling Cookies',
                        'content' => '<p>You can manage, restrict, or delete cookies through your browser settings. Disabling non-essential cookies may affect certain Website features and your browsing experience.</p>'
                    ]
                ]
            ],
            'disclaimer' => [
                'title' => 'Disclaimer',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => '1. Color & Visual Variation',
                        'content' => '<p>Product colors displayed on the Website may vary slightly from the actual product due to monitor calibration, screen resolution, lighting conditions, and image compression. Such variations shall not constitute a defect or ground for return or refund.</p>'
                    ],
                    [
                        'title' => '2. Handcrafted & Print Variation',
                        'content' => '<p>Many Avhira products feature Jaipuri hand-block prints, hand embroidery, natural dyeing, and artisanal craftsmanship. Natural variations in print placement, color intensity, texture, and embroidery are inherent characteristics of handcrafted products and shall not be considered manufacturing defects.</p>'
                    ],
                    [
                        'title' => '3. Sizing & Fit Disclaimer',
                        'content' => '<p>Size measurements are approximate and may vary by 1–2 cm. Customers are strongly advised to refer to the size chart on each product page before placing an order.</p>'
                    ],
                    [
                        'title' => '4. Styling & Props Disclaimer',
                        'content' => '<p>Product photographs may include props, accessories, jewellery, or background elements used purely for styling. These are not included with the product unless expressly stated in the product description.</p>'
                    ],
                    [
                        'title' => '5. Third-Party Service Disclaimer',
                        'content' => '<p>Avhira shall not be responsible for errors, delays, inaccuracies, data breaches, or service disruptions caused by third-party logistics partners, payment gateways, IT providers, or analytics tools.</p>'
                    ]
                ]
            ],
            'grievance-redressal' => [
                'title' => 'Grievance Redressal Mechanism',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => 'Grievance Officer Information',
                        'content' => '<table class="table-auto w-full text-left border-collapse border border-gray-200"><tbody><tr><td class="border border-gray-200 p-2 font-semibold">Grievance Officer</td><td class="border border-gray-200 p-2">Designated Representative, Avhira</td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Email</td><td class="border border-gray-200 p-2"><a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a></td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Contact Number</td><td class="border border-gray-200 p-2">+91-9157903173</td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Acknowledgement</td><td class="border border-gray-200 p-2">Within 48 business hours</td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Resolution Timeframe</td><td class="border border-gray-200 p-2">Within 1 month of receipt of complaint</td></tr></tbody></table><p class="mt-4">If your grievance is not satisfactorily resolved within the above timelines, you may approach the Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019, or the National Consumer Helpline (NCH) at 1915.</p>'
                    ]
                ]
            ],
            'faqs' => [
                'title' => 'Frequently Asked Questions (FAQs)',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => 'Orders & Payments',
                        'content' => '<ul class="list-disc pl-5 mt-2 space-y-2"><li><strong>How do I place an order?</strong> Browse the Website, select your products and size, add to cart, and complete checkout.</li><li><strong>What payment methods are accepted?</strong> UPI, debit/credit cards (Visa, Mastercard, RuPay), net banking, digital wallets, EMI, and Cash on Delivery where available.</li><li><strong>Will I receive a GST invoice?</strong> Yes, a valid GST invoice is issued for every order.</li><li><strong>Can I modify my order after placing it?</strong> Address or product modifications may be possible before dispatch. Contact us immediately at <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a>.</li></ul>'
                    ],
                    [
                        'title' => 'Shipping & Tracking',
                        'content' => '<ul class="list-disc pl-5 mt-2 space-y-2"><li><strong>How long does delivery take?</strong> Typically 3–12 business days depending on your location. See Section 3 for details.</li><li><strong>How do I track my order?</strong> Tracking details are shared via SMS, email, or WhatsApp after dispatch.</li><li><strong>Do you ship across all of India?</strong> We ship to most pin codes. Certain remote areas may not be serviceable — availability is checked at checkout.</li></ul>'
                    ],
                    [
                        'title' => 'Returns & Refunds',
                        'content' => '<ul class="list-disc pl-5 mt-2 space-y-2"><li><strong>What is the return window?</strong> Returns must be initiated within 7 days of delivery, subject to eligibility criteria in Section 4.</li><li><strong>How long does a refund take?</strong> Approved refunds are processed within 5–10 business days depending on your payment method.</li><li><strong>What if I received a damaged or wrong product?</strong> Report within 48 hours of delivery with photographs to <a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a>.</li><li><strong>Can I exchange for a different size?</strong> Yes, eligible products may be exchanged subject to stock availability per Section 4.</li></ul>'
                    ],
                    [
                        'title' => 'Products',
                        'content' => '<ul class="list-disc pl-5 mt-2 space-y-2"><li><strong>How do I choose the correct size?</strong> Each product page includes a detailed size chart. Minor variations of 1–2 cm may occur.</li><li><strong>Why does the color look different from the photograph?</strong> Screen calibration and photography lighting can cause slight variations. This is not a defect.</li><li><strong>Are the products authentic handcrafted items?</strong> Yes. Many products feature traditional Jaipuri hand-block printing, natural dyes, and artisanal embroidery. Natural variations are part of their authenticity.</li></ul>'
                    ]
                ]
            ],
            'contact-us' => [
                'title' => 'Contact Us',
                'lastRevised' => 'July 1, 2025',
                'sections' => [
                    [
                        'title' => 'Get in Touch',
                        'content' => '<table class="table-auto w-full text-left border-collapse border border-gray-200"><tbody><tr><td class="border border-gray-200 p-2 font-semibold">Customer Support Email</td><td class="border border-gray-200 p-2"><a href="mailto:avhirahouse@gmail.com">avhirahouse@gmail.com</a></td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Customer Support Number</td><td class="border border-gray-200 p-2">+91-9157903173</td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Support Hours</td><td class="border border-gray-200 p-2">Monday to Saturday, 10:00 AM – 6:00 PM IST (excluding public holidays)</td></tr><tr><td class="border border-gray-200 p-2 font-semibold">Website</td><td class="border border-gray-200 p-2"><a href="https://avhira.com">https://avhira.com</a></td></tr></tbody></table><p class="mt-4">We endeavour to respond to all queries within 24–48 business hours. For order-specific queries, please have your Order ID ready when contacting us.</p>'
                    ]
                ]
            ]
        ];
    }

    public function show($slug)
    {
        $policies = $this->getPolicies();

        if (!array_key_exists($slug, $policies)) {
            abort(404);
        }

        return Inertia::render('Policies/Policy', $policies[$slug]);
    }
}