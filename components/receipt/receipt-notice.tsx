import { EMAIL_MESSAGES } from '@/lib/constants/email';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReceiptNotice() {
  const { TITLE, DESCRIPTION, NOTICE, SENDER } = EMAIL_MESSAGES.RECEIPT;

  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle>{TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{DESCRIPTION}</p>
        <p className="text-sm text-muted-foreground">{NOTICE}</p>
        <p className="text-sm text-muted-foreground">{SENDER}</p>
      </CardContent>
    </Card>
  );
}
