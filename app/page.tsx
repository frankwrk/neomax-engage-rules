import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ROUTES } from "@/lib/constants"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-20 md:py-32 text-text-light">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">Watch. Answer. Win.</h1>
              <p className="text-lg md:text-xl">
                Engage with ads, answer simple questions, and win exciting prizes. It's that easy!
              </p>
              <div className="pt-4">
                <Link href={ROUTES.SIGN_UP}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Start Winning Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-neutral">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">Three simple steps to win amazing prizes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Watch an Ad</h3>
                <p className="text-muted-foreground">
                  Watch a short advertisement from our sponsors to qualify for entry.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Answer a Question</h3>
                <p className="text-muted-foreground">Answer a simple question about the ad you just watched.</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Win Prizes</h3>
                <p className="text-muted-foreground">
                  Get entered into the prize draw for a chance to win amazing rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Prizes Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">Featured Prizes</h2>
              <p className="mt-4 text-lg text-muted-foreground">Check out some of our exciting prizes up for grabs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="prize-card">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Weekend Getaway"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Weekend Getaway</h3>
                  <p className="text-muted-foreground mb-4">Win a luxurious weekend break for two at a 5-star hotel.</p>
                  <Link href={ROUTES.COMPETITIONS}>
                    <Button className="w-full">Enter Now</Button>
                  </Link>
                </div>
              </div>

              <div className="prize-card">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Latest Smartphone"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Latest Smartphone</h3>
                  <p className="text-muted-foreground mb-4">Get your hands on the newest flagship smartphone.</p>
                  <Link href={ROUTES.COMPETITIONS}>
                    <Button className="w-full">Enter Now</Button>
                  </Link>
                </div>
              </div>

              <div className="prize-card">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Shopping Spree"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Shopping Spree</h3>
                  <p className="text-muted-foreground mb-4">
                    Win a €500 shopping voucher to spend at your favorite stores.
                  </p>
                  <Link href={ROUTES.COMPETITIONS}>
                    <Button className="w-full">Enter Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-neutral">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">Winner Stories</h2>
              <p className="mt-4 text-lg text-muted-foreground">Hear from some of our lucky winners</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">J</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">John D.</h3>
                    <p className="text-sm text-muted-foreground">Dublin</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I couldn't believe it when I got the call saying I'd won the weekend getaway! The whole process was
                  so simple - I just watched an ad, answered a question, and a week later I was packing my bags for a
                  5-star hotel stay!"
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">S</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah M.</h3>
                    <p className="text-sm text-muted-foreground">Cork</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Neomax Engage is my favorite way to win prizes. It's free to enter, takes just a minute of my time,
                  and I've already won twice! My new smartphone arrived just three days after the draw."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 hero-gradient text-text-light">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Winning?</h2>
              <p className="text-lg">Join thousands of winners today. Sign up is quick, easy, and completely free.</p>
              <div className="pt-4">
                <Link href={ROUTES.SIGN_UP}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

