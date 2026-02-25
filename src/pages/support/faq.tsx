import { Link } from 'react-router';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'What is Tambola?',
        answer: 'Tambola (also known as Housie or Bingo) is a popular game of chance where players mark off numbers on their tickets as they are randomly called out. Complete specific patterns to win prizes!',
      },
      {
        question: 'How do I join a game?',
        answer: 'Visit the Game Lobby to see all available games. Click on a game to view details, then purchase a ticket to join. Once the game starts, you can mark numbers on your ticket.',
      },
      {
        question: 'Is it free to play?',
        answer: 'Yes! Tambola Pro is completely free to play. There is no real money involved - it\'s purely for entertainment purposes.',
      },
    ],
  },
  {
    category: 'Gameplay',
    questions: [
      {
        question: 'How are numbers called?',
        answer: 'Numbers are called randomly by our certified random number generator. They are displayed on screen and announced automatically. Each game calls numbers from 1 to 90.',
      },
      {
        question: 'What happens if I miss marking a number?',
        answer: 'Don\'t worry! You can mark missed numbers at any time before claiming a prize. However, you must mark all required numbers before making a claim.',
      },
      {
        question: 'How do I claim a prize?',
        answer: 'When you complete a winning pattern, a "Claim" button will appear. Click it immediately to claim your prize. Be quick - claims must be made before the next number is called!',
      },
      {
        question: 'What are the winning patterns?',
        answer: 'Common patterns include: Early Five (first 5 numbers), Top Line (first row), Middle Line (second row), Bottom Line (third row), Corners (all 4 corners), and Full House (all numbers on ticket).',
      },
    ],
  },
  {
    category: 'Account & Technical',
    questions: [
      {
        question: 'Do I need an account to play?',
        answer: 'Yes, you need to sign up for a free account to track your games, tickets, and winnings. Sign up is quick and easy!',
      },
      {
        question: 'What devices can I play on?',
        answer: 'Tambola Pro works on any device with a modern web browser - desktop computers, laptops, tablets, and smartphones.',
      },
      {
        question: 'What if I experience connection issues?',
        answer: 'If you lose connection during a game, try refreshing the page. Your marked numbers are saved, and you\'ll rejoin the game in progress.',
      },
    ],
  },
  {
    category: 'Rules & Fair Play',
    questions: [
      {
        question: 'Is the game fair?',
        answer: 'Absolutely! We use a certified random number generator to ensure completely random and fair number selection. All players have an equal chance of winning.',
      },
      {
        question: 'Can I play multiple tickets?',
        answer: 'Some games allow multiple tickets per player. Check the game details before joining to see the ticket limit.',
      },
      {
        question: 'What happens if I make a false claim?',
        answer: 'False claims are automatically detected by our system. Repeated false claims may result in account restrictions.',
      },
    ],
  },
];

export function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Find answers to common questions about Tambola Pro</p>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {faqs.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {sectionIndex + 1}
                </span>
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${sectionIndex}-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <Card className="mt-12 max-w-4xl mx-auto bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <Link to="/contact">
            <Button className="gap-2">
              Contact Support
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default FAQPage;
