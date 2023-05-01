import Stripe from "stripe";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  currency: string;
};

const Pricing = ({ plans }: { plans: Plan[] }) => {
  const locale = "id-ID"; // Lokalisasi Indonesia
  const currency = "IDR";
  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan: Plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            {new Intl.NumberFormat(locale, {
              style: "currency",
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(plan.price / 100)}
            / {plan.interval}
          </p>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-11-15",
  });

  const { data: prices } = await stripe.prices.list({
    active: true,
    type: "recurring",
  });

  const plans = await Promise.all(
    prices.map(async (price: any) => {
      const product = await stripe.products.retrieve(price.product);
      const interval = price.recurring?.interval || null;

      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval,
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  console.log("PLANS", plans);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;