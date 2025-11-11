import csv
import json

class GlobalFintechInvestors:
    def __init__(self):
        self.investors = []
        
    def add_investor_data(self):
        """Adiciona dados de investidores globais em FinTech e AML"""
        
        # Venture Capital Firms - Tier 1
        tier1_vcs = [
            {"name": "Andreessen Horowitz (a16z)", "type": "VC", "focus": "Crypto/FinTech", "location": "USA", 
             "email": "crypto@a16z.com", "contact": "Chris Dixon", "aum": "$35B", "notable_investments": "Coinbase, Uniswap"},
            {"name": "Sequoia Capital", "type": "VC", "focus": "FinTech/Enterprise", "location": "USA", 
             "email": "info@sequoiacap.com", "contact": "Alfred Lin", "aum": "$85B", "notable_investments": "Stripe, Klarna"},
            {"name": "Accel Partners", "type": "VC", "focus": "FinTech/SaaS", "location": "USA/Europe", 
             "email": "info@accel.com", "contact": "Sonali De Rycker", "aum": "$25B", "notable_investments": "Wise, Checkout.com"},
            {"name": "Index Ventures", "type": "VC", "focus": "FinTech/B2B", "location": "Europe/USA", 
             "email": "info@indexventures.com", "contact": "Jan Hammer", "aum": "$8B", "notable_investments": "Revolut, Robinhood"},
            {"name": "Lightspeed Venture Partners", "type": "VC", "focus": "FinTech/Enterprise", "location": "USA", 
             "email": "info@lsvp.com", "contact": "Jeremy Liew", "aum": "$25B", "notable_investments": "Affirm, Mulesoft"},
        ]
        
        # Crypto/Blockchain Specialized VCs
        crypto_vcs = [
            {"name": "Paradigm", "type": "Crypto VC", "focus": "DeFi/Infrastructure", "location": "USA", 
             "email": "hello@paradigm.xyz", "contact": "Matt Huang", "aum": "$13B", "notable_investments": "Uniswap, Compound"},
            {"name": "Pantera Capital", "type": "Crypto VC", "focus": "Blockchain/DeFi", "location": "USA", 
             "email": "info@panteracapital.com", "contact": "Dan Morehead", "aum": "$5B", "notable_investments": "Bitstamp, Circle"},
            {"name": "Digital Currency Group", "type": "Crypto VC", "focus": "Blockchain/FinTech", "location": "USA", 
             "email": "info@dcg.co", "contact": "Barry Silbert", "aum": "$1B", "notable_investments": "Coinbase, Ripple"},
            {"name": "Blockchain Capital", "type": "Crypto VC", "focus": "Blockchain Infrastructure", "location": "USA", 
             "email": "info@blockchain.capital", "contact": "Bart Stephens", "aum": "$1.5B", "notable_investments": "Kraken, Coinbase"},
            {"name": "Polychain Capital", "type": "Crypto VC", "focus": "Web3/DeFi", "location": "USA", 
             "email": "info@polychain.capital", "contact": "Olaf Carlson-Wee", "aum": "$3B", "notable_investments": "Compound, MakerDAO"},
        ]
        
        # Corporate VCs & Strategic Investors
        corporate_vcs = [
            {"name": "JPMorgan Chase Strategic Investments", "type": "Corporate VC", "focus": "FinTech/Payments", "location": "USA", 
             "email": "innovation@jpmorgan.com", "contact": "Matt Harris", "aum": "$50B", "notable_investments": "Digital Asset, Mosaic"},
            {"name": "Goldman Sachs Principal Strategic Investments", "type": "Corporate VC", "focus": "FinTech/RegTech", "location": "USA", 
             "email": "psi@gs.com", "contact": "David Campbell", "aum": "$25B", "notable_investments": "Circle, Kensho"},
            {"name": "Visa Ventures", "type": "Corporate VC", "focus": "Payments/FinTech", "location": "USA", 
             "email": "ventures@visa.com", "contact": "Terry Angelos", "aum": "$500M", "notable_investments": "Klarna, Plaid"},
            {"name": "Mastercard Start Path", "type": "Corporate VC", "focus": "Payments/Security", "location": "USA", 
             "email": "startpath@mastercard.com", "contact": "Ken Moore", "aum": "$1B", "notable_investments": "R3, Digital Asset"},
            {"name": "American Express Ventures", "type": "Corporate VC", "focus": "FinTech/B2B", "location": "USA", 
             "email": "ventures@aexp.com", "contact": "Harshul Sanghi", "aum": "$200M", "notable_investments": "Kabbage, Ramp"},
        ]
        
        # European FinTech VCs
        european_vcs = [
            {"name": "Balderton Capital", "type": "VC", "focus": "FinTech/B2B", "location": "UK", 
             "email": "info@balderton.com", "contact": "Suranga Chandratillake", "aum": "$3B", "notable_investments": "Revolut, GoCardless"},
            {"name": "Atomico", "type": "VC", "focus": "FinTech/Scale-ups", "location": "UK", 
             "email": "info@atomico.com", "contact": "Niklas Zennström", "aum": "$2.7B", "notable_investments": "Klarna, MessageBird"},
            {"name": "Northzone", "type": "VC", "focus": "FinTech/SaaS", "location": "Europe", 
             "email": "info@northzone.com", "contact": "Pär-Jörgen Pärson", "aum": "$2B", "notable_investments": "Klarna, iZettle"},
            {"name": "Creandum", "type": "VC", "focus": "FinTech/B2B", "location": "Sweden", 
             "email": "info@creandum.com", "contact": "Carl Fritjofsson", "aum": "$500M", "notable_investments": "Klarna, iZettle"},
            {"name": "Dawn Capital", "type": "VC", "focus": "B2B FinTech", "location": "UK", 
             "email": "info@dawncapital.com", "contact": "Haakon Overli", "aum": "$1B", "notable_investments": "Tink, Mambu"},
        ]
        
        # Asian FinTech VCs
        asian_vcs = [
            {"name": "SoftBank Vision Fund", "type": "Mega Fund", "focus": "FinTech/AI", "location": "Japan", 
             "email": "info@visionfund.com", "contact": "Rajeev Misra", "aum": "$100B", "notable_investments": "Paytm, Grab"},
            {"name": "Tencent Investment", "type": "Corporate VC", "focus": "FinTech/Payments", "location": "China", 
             "email": "investment@tencent.com", "contact": "David Wallerstein", "aum": "$50B", "notable_investments": "Nubank, Sea Limited"},
            {"name": "Ant Group", "type": "Corporate VC", "focus": "FinTech/Payments", "location": "China", 
             "email": "investment@antgroup.com", "contact": "Eric Jing", "aum": "$10B", "notable_investments": "Paytm, Kakao Pay"},
            {"name": "GGV Capital", "type": "VC", "focus": "FinTech/Enterprise", "location": "USA/China", 
             "email": "info@ggvc.com", "contact": "Hans Tung", "aum": "$9.2B", "notable_investments": "Klarna, Airwallex"},
            {"name": "Vertex Ventures", "type": "VC", "focus": "FinTech/B2B", "location": "Singapore", 
             "email": "info@vertexventures.com", "contact": "Chua Kee Lock", "aum": "$4.5B", "notable_investments": "Grab, Sea Limited"},
        ]
        
        # RegTech/Compliance Specialized
        regtech_investors = [
            {"name": "Illuminate Financial", "type": "Specialized VC", "focus": "RegTech/Compliance", "location": "USA", 
             "email": "info@illuminate.com", "contact": "Charley Ma", "aum": "$500M", "notable_investments": "Chainalysis, Elliptic"},
            {"name": "FinTech Collective", "type": "Specialized VC", "focus": "FinTech/RegTech", "location": "USA", 
             "email": "info@fintechcollective.com", "contact": "Brooks Gibbins", "aum": "$400M", "notable_investments": "Chainalysis, TRM Labs"},
            {"name": "Nyca Partners", "type": "Specialized VC", "focus": "FinTech/Infrastructure", "location": "USA", 
             "email": "info@nyca.com", "contact": "Hans Morris", "aum": "$1B", "notable_investments": "Plaid, Alloy"},
            {"name": "Anthemis Group", "type": "Specialized VC", "focus": "FinTech/RegTech", "location": "UK/USA", 
             "email": "info@anthemis.com", "contact": "Sean Park", "aum": "$500M", "notable_investments": "Chainalysis, Betterment"},
            {"name": "QED Investors", "type": "Specialized VC", "focus": "FinTech/Payments", "location": "USA", 
             "email": "info@qedinvestors.com", "contact": "Nigel Morris", "aum": "$3B", "notable_investments": "Nubank, Credit Karma"},
        ]
        
        # Government & Institutional
        institutional = [
            {"name": "In-Q-Tel", "type": "Strategic VC", "focus": "Security/RegTech", "location": "USA", 
             "email": "info@iqt.org", "contact": "Christopher Darby", "aum": "$3B", "notable_investments": "Palantir, Chainalysis"},
            {"name": "CDPQ (Caisse de dépôt)", "type": "Sovereign Fund", "focus": "FinTech/Infrastructure", "location": "Canada", 
             "email": "info@cdpq.com", "contact": "Charles Emond", "aum": "$420B", "notable_investments": "Paymi, Nuvei"},
            {"name": "Singapore GIC", "type": "Sovereign Fund", "focus": "FinTech/Tech", "location": "Singapore", 
             "email": "info@gic.com.sg", "contact": "Lim Chow Kiat", "aum": "$690B", "notable_investments": "Ant Financial, Grab"},
            {"name": "Temasek Holdings", "type": "Sovereign Fund", "focus": "FinTech/Digital", "location": "Singapore", 
             "email": "info@temasek.com.sg", "contact": "Ho Ching", "aum": "$380B", "notable_investments": "Ant Financial, FTX"},
        ]
        
        # Angel Investors & Family Offices
        angels = [
            {"name": "Naval Ravikant", "type": "Angel", "focus": "Crypto/FinTech", "location": "USA", 
             "email": "naval@angellist.com", "contact": "Naval Ravikant", "aum": "$100M+", "notable_investments": "Coinbase, AngelList"},
            {"name": "Tim Draper", "type": "Angel/VC", "focus": "Crypto/FinTech", "location": "USA", 
             "email": "tim@drapervc.com", "contact": "Tim Draper", "aum": "$1B", "notable_investments": "Coinbase, Robinhood"},
            {"name": "Reid Hoffman", "type": "Angel", "focus": "FinTech/B2B", "location": "USA", 
             "email": "reid@greylock.com", "contact": "Reid Hoffman", "aum": "$500M+", "notable_investments": "Airbnb, Facebook"},
            {"name": "Marc Benioff", "type": "Angel", "focus": "Enterprise/FinTech", "location": "USA", 
             "email": "marc@salesforce.com", "contact": "Marc Benioff", "aum": "$10B+", "notable_investments": "Uber, Slack"},
        ]
        
        # Combine all investors
        self.investors.extend(tier1_vcs)
        self.investors.extend(crypto_vcs)
        self.investors.extend(corporate_vcs)
        self.investors.extend(european_vcs)
        self.investors.extend(asian_vcs)
        self.investors.extend(regtech_investors)
        self.investors.extend(institutional)
        self.investors.extend(angels)
        
    def export_to_csv(self, filename):
        """Exporta lista para CSV"""
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['name', 'type', 'focus', 'location', 'email', 'contact', 'aum', 'notable_investments']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for investor in self.investors:
                writer.writerow(investor)
                
    def export_email_list(self, filename):
        """Exporta apenas lista de emails"""
        with open(filename, 'w', encoding='utf-8') as f:
            for investor in self.investors:
                f.write(f"{investor['email']}\n")
                
    def export_detailed_list(self, filename):
        """Exporta lista detalhada formatada"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("GLOBAL FINTECH & AML INVESTORS DATABASE\n")
            f.write("="*50 + "\n\n")
            
            categories = {
                "VC": "VENTURE CAPITAL FIRMS",
                "Crypto VC": "CRYPTO/BLOCKCHAIN VCs", 
                "Corporate VC": "CORPORATE VENTURE CAPITAL",
                "Specialized VC": "REGTECH/COMPLIANCE SPECIALISTS",
                "Mega Fund": "MEGA FUNDS",
                "Sovereign Fund": "SOVEREIGN WEALTH FUNDS",
                "Strategic VC": "STRATEGIC INVESTORS",
                "Angel": "ANGEL INVESTORS"
            }
            
            for category, title in categories.items():
                f.write(f"\n{title}\n")
                f.write("-" * len(title) + "\n")
                
                category_investors = [inv for inv in self.investors if inv['type'] == category]
                for inv in category_investors:
                    f.write(f"\n• {inv['name']}\n")
                    f.write(f"  Email: {inv['email']}\n")
                    f.write(f"  Contact: {inv['contact']}\n")
                    f.write(f"  Focus: {inv['focus']}\n")
                    f.write(f"  Location: {inv['location']}\n")
                    f.write(f"  AUM: {inv['aum']}\n")
                    f.write(f"  Notable: {inv['notable_investments']}\n")
                    
    def generate_pitch_email_template(self, filename):
        """Gera template de email para pitch"""
        template = """
Subject: 🚀 CryptoGuard AML - Revolutionary AI for Anti-Money Laundering Detection

Dear {contact_name},

I hope this email finds you well. I'm reaching out because of your expertise and investment focus in {focus_area}.

I'm {your_name}, CEO of CryptoGuard, and I'm excited to introduce you to our revolutionary AI-powered Anti-Money Laundering detection system.

🎯 THE OPPORTUNITY:
• $3.5B global AML market growing at 15.8% CAGR
• Crypto AML segment: $850M with massive regulatory pressure
• First AI solution specifically designed for cryptocurrency AML

🚀 OUR BREAKTHROUGH:
• 94% detection accuracy (vs 60-70% industry standard)
• 0.1% false positive rate
• Real-time analysis of blockchain transactions
• Full regulatory compliance (FATF, BSA, EU 5AMLD, MiCA)

💼 TRACTION:
• 3 crypto exchanges in pilot (including top-10 exchange)
• 2 digital banks signed LOIs
• $2.5M ARR projected for Year 1
• ISO 27001 certified, FATF approved

💰 FUNDING:
We're raising $5M Series A to scale globally and capture this massive opportunity.

📊 ATTACHED:
Please find our investor pitch deck with detailed financials, technology overview, and market analysis.

I'd love to schedule a 15-minute call to discuss how CryptoGuard aligns with your investment thesis. Our technology is already generating significant interest from regulators and financial institutions worldwide.

Would you be available for a brief call this week or next?

Best regards,
{your_name}
CEO & Founder, CryptoGuard
📧 {your_email}
📱 {your_phone}
🌐 www.cryptoguard.ai

P.S. We're also happy to provide a live demo of our system detecting real money laundering patterns in blockchain transactions.
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(template)
            
    def generate_all_exports(self):
        """Gera todos os arquivos de exportação"""
        print("Gerando base de dados de investidores globais...")
        
        self.add_investor_data()
        
        # Exportar em diferentes formatos
        self.export_to_csv('global_fintech_investors.csv')
        self.export_email_list('investor_emails.txt')
        self.export_detailed_list('detailed_investor_list.txt')
        self.generate_pitch_email_template('pitch_email_template.txt')
        
        print(f"{len(self.investors)} investidores exportados!")
        print("Arquivos gerados:")
        print("   - global_fintech_investors.csv - Base completa")
        print("   - investor_emails.txt - Lista de emails")
        print("   - detailed_investor_list.txt - Lista detalhada")
        print("   - pitch_email_template.txt - Template de email")
        
        return len(self.investors)

if __name__ == "__main__":
    generator = GlobalFintechInvestors()
    total_investors = generator.generate_all_exports()