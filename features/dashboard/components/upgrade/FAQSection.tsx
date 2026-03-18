import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preguntas frecuentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-medium">{faq.question}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}