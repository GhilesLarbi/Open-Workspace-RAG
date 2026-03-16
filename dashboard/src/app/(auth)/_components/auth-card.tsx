import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>

      <CardFooter className="justify-center">
        <div className="text-sm text-muted-foreground">
          {footerText}{" "}
          <Link 
            href={footerLinkHref} 
            className="font-medium text-foreground hover:text-primary hover:underline"
          >
            {footerLinkText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}