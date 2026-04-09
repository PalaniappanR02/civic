import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-cyan-400" />,
      title: "Email",
      value: "support@civicconnect.io",
      desc: "Send us an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6 text-lime-400" />,
      title: "Phone",
      value: "+91 (555) 123-4567",
      desc: "Call us during business hours",
    },
    {
      icon: <MapPin className="w-6 h-6 text-coral-400" />,
      title: "Office",
      value: "Bangalore, India",
      desc: "Visit our headquarters",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: "Chat",
      value: "Live support available",
      desc: "Chat with our team",
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Contact us anytime.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactMethods.map((method, idx) => (
          <Card key={idx} className="glass-card p-6 rounded-2xl hover:border-cyan-500/50 transition-all">
            <div className="mb-4">{method.icon}</div>
            <h3 className="font-bold mb-2">{method.title}</h3>
            <p className="text-sm font-semibold text-cyan-300 mb-1">{method.value}</p>
            <p className="text-xs text-muted-foreground">{method.desc}</p>
          </Card>
        ))}
      </div>

      {/* Contact Form and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <Card className="glass-card p-8 rounded-2xl lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name..."
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-cyan-500/50"
                required
              >
                <option value="">Select a subject...</option>
                <option value="feedback">Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50"
                required
              />
            </div>

            <Button className="w-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30">
              Send Message
            </Button>
          </form>
        </Card>

        {/* Info */}
        <Card className="glass-card p-8 rounded-2xl h-fit">
          <h2 className="text-2xl font-bold mb-6">Quick Info</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-cyan-300 mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours during business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lime-300 mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM IST
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-coral-300 mb-2">Support Channels</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email support</li>
                <li>• Phone support</li>
                <li>• Live chat</li>
                <li>• Community forum</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Follow Us</h3>
              <div className="flex gap-2">
                {["Twitter", "LinkedIn", "GitHub", "Facebook"].map((social) => (
                  <button
                    key={social}
                    className="px-3 py-1 rounded text-xs bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How do I report an issue?",
              a: "Go to the Reports page and click 'New Report'. Fill in the details and submit.",
            },
            {
              q: "How long does it take to resolve issues?",
              a: "Average resolution time is 4.7 days, but it varies by category and priority.",
            },
            {
              q: "Can I track my report?",
              a: "Yes, you can track all reports on the Timeline page with real-time updates.",
            },
            {
              q: "How are predictions made?",
              a: "Our ML models analyze historical data to predict trends and resolution times.",
            },
            {
              q: "Is my data secure?",
              a: "Yes, we use industry-standard encryption and security practices.",
            },
            {
              q: "How can I contribute?",
              a: "Report issues, upvote important reports, and help improve our community.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold text-cyan-300 mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
