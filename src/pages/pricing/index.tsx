import { GetServerSidePropsContext } from "next";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/context/user";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  currency: string;
};

export default function Pricing({ plans }: { plans: Plan[] }) {
  const { user, login, isLoading } = useUserContext();
  const locale = "id-ID"; // Lokalisasi Indonesia
  const currency = "IDR";

  console.log("PRICING - USER", user);

  const processSubscription = (planId: string) => async () => {
    const response = await fetch(`/api/subscription/${planId}`, {
      method: "GET",
    });

    const data = await response.json();
    console.log("PRICING - PROCESS SUB", data);
  };

  const showSubscribeButton = user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = user && user.is_subscribed;

  return (
    <>
      <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
        {plans.map((plan: Plan) => (
          <div key={plan.id} className="w-80 rounded shadow px-6 py-4">
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

            {!isLoading && (
              <div>
                {showSubscribeButton && (
                  <button
                    className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500"
                    onClick={processSubscription(plan.id)}>
                    Subscribe
                  </button>
                )}
                {showCreateAccountButton && (
                  <button
                    onClick={login}
                    className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                    Create Account
                  </button>
                )}
                {showManageSubscriptionButton && (
                  <button className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                    Manage Subscription
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {user && (
        <pre className="w-full max-w-3xl mx-auto my-8 px-2 text-center text-red-700">
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // buat authenticated supabase client
  const supabaseServerClient = createServerSupabaseClient<Database>(ctx);
  // cek sesi
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

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

  if (!session) {
    return {
      props: {
        plans: sortedPlans,
      },
    };
  }

  return {
    props: {
      plans: sortedPlans,
      initialSession: session,
      user: session.user,
    },
  };
};
