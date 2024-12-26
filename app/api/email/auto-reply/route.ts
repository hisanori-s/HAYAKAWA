import { NextResponse } from 'next/server';
import { EMAIL_MESSAGES } from '@/lib/constants/email';

interface AutoReplyRequest {
  email: string;
  orderId: string;
}

export async function POST(request: Request) {
  try {
    const { email, orderId }: AutoReplyRequest = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが指定されていません' },
        { status: 400 }
      );
    }

    // TODO: ここに実際のメール送信処理を実装
    // 例: SendGrid, AWS SES, nodemailerなど
    console.log('Auto reply email would be sent:', {
      to: email,
      subject: EMAIL_MESSAGES.AUTO_REPLY.SUBJECT,
      body: EMAIL_MESSAGES.AUTO_REPLY.BODY,
      orderId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auto reply email error:', error);
    return NextResponse.json(
      { error: 'メールの送信に失敗しました' },
      { status: 500 }
    );
  }
}
