import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const reviews = [
  {
    id: 1,
    name: 'Jane Doe',
    avatar: 'https://via.placeholder.com/50',
    review:
      'YourCloud has been a game-changer for my business. The secure storage and easy sharing options are top-notch!',
    rating: 5,
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://via.placeholder.com/50',
    review:
      'I love how seamless and fast the platform is. Accessing my files from anywhere has never been easier!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Alice Brown',
    avatar: 'https://via.placeholder.com/50',
    review:
      'The UI is intuitive and easy to navigate. Plus, the customer support team is fantastic!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Mike Johnson',
    avatar: 'https://via.placeholder.com/50',
    review:
      'Highly recommend YourCloud! The version history feature saved me multiple times.',
    rating: 4,
  },
  {
    id: 5,
    name: 'Sarah Williams',
    avatar: 'https://via.placeholder.com/50',
    review:
      'YourCloud’s user experience is unparalleled. I couldn’t ask for a better service.',
    rating: 5,
  },
  {
    id: 6,
    name: 'James Taylor',
    avatar: 'https://via.placeholder.com/50',
    review:
      'The reliability and speed of YourCloud make it a must-have for professionals.',
    rating: 4,
  },
];

export default function Reviews() {
  return (
    <section className=" text-white py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={review.id}
              className={`p-6 bg-transparent blur-sm rounded-lg shadow-lg hover:blur-none transition-all ${
                index % 2 === 0 ? 'row-span-2' : 'col-span-1'
              }`}
            >
              <CardHeader className="flex items-center mb-4">
                {/* <img
                  src={review.avatar}
                  alt={`${review.name}'s avatar`}
                  className="w-12 h-12 rounded-full mr-4"
                /> */}
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
                <p className="text-gray-400">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
