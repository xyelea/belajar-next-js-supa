import initStripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";

type Data = {
  email: string;
  id: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  });

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  await supabase
    .from("profiles")
    .update({
      stripe_customer: customer.id,
    })
    .eq("id", req.body.record.id);

  res.send(`stripe customer created : ${customer.id}` as any);
};

export default handler;
