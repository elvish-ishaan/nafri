import { Star, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Marquee } from '@/components/magicui/marquee';

const reviews = [
  {
    id: 1,
    name: 'Jane Doe',
    review:
      'YourCloud has been a game-changer for my business. The secure storage and easy sharing options are top-notch!',
    rating: 5,
  },
  {
    id: 2,
    name: 'John Smith',
    review:
      'I love how seamless and fast the platform is. Accessing my files from anywhere has never been easier!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Alice Brown',
    review:
      'The UI is intuitive and easy to navigate. Plus, the customer support team is fantastic!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Mike Johnson',
    review:
      'Highly recommend YourCloud! The version history feature saved me multiple times.',
    rating: 4,
  },
  {
    id: 5,
    name: 'Sarah Williams',
    review:
      'YourCloud\'s user experience is unparalleled. I couldn\'t ask for a better service.',
    rating: 5,
  },
  {
    id: 6,
    name: 'James Taylor',
    review:
      'The reliability and speed of YourCloud make it a must-have for professionals.',
    rating: 4,
  },
];

export default function Reviews() {
  return (
    <section className="bg-card text-card-foreground py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="relative overflow-hidden">
          <Marquee className="py-4" pauseOnHover>
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="mx-4 w-[350px] bg-secondary/50 border border-border backdrop-blur-sm hover:border-border/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--ring),0.1)] hover:scale-[1.02]"
              >
                <CardHeader className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-background/50 border border-border flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{review.name}</CardTitle>
                    <CardDescription className="flex">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
