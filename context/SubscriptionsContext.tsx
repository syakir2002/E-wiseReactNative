import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import { posthog } from "@/lib/posthog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "@e-wise/custom-subscriptions";

type PersistedSubscription = Omit<Subscription, "icon">;

export type NewSubscriptionInput = Pick<
  Subscription,
  "name" | "price" | "billing"
> &
  Partial<Pick<Subscription, "plan" | "category">>;

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  isLoaded: boolean;
  loadError: string | null;
  addSubscription: (input: NewSubscriptionInput) => Promise<Subscription>;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(
  null,
);

function isPersistedSubscription(
  value: unknown,
): value is PersistedSubscription {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const subscription = value as Record<string, unknown>;
  const optionalStringFields = [
    "plan",
    "category",
    "paymentMethod",
    "status",
    "startDate",
    "currency",
    "renewalDate",
    "color",
  ];

  return (
    typeof subscription.id === "string" &&
    typeof subscription.name === "string" &&
    typeof subscription.price === "number" &&
    Number.isFinite(subscription.price) &&
    subscription.price > 0 &&
    typeof subscription.billing === "string" &&
    optionalStringFields.every(
      (key) =>
        subscription[key] === undefined ||
        typeof subscription[key] === "string",
    )
  );
}

function parsePersistedSubscriptions(value: string): Subscription[] {
  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error("Saved subscriptions have an invalid format.");
  }

  return parsed.map((entry: unknown) => {
    if (!isPersistedSubscription(entry)) {
      throw new Error("A saved subscription has an invalid format.");
    }

    return { ...entry, icon: icons.plus };
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to access saved subscriptions.";
}

export function SubscriptionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customSubscriptions, setCustomSubscriptions] = useState<
    Subscription[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptions() {
      try {
        const savedSubscriptions = await AsyncStorage.getItem(STORAGE_KEY);

        if (isMounted && savedSubscriptions) {
          setCustomSubscriptions(parsePersistedSubscriptions(savedSubscriptions));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    void loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const addSubscription = useCallback(
    async (input: NewSubscriptionInput) => {
      if (!isLoaded || loadError) {
        throw new Error(
          loadError ?? "Subscriptions are still loading. Please try again.",
        );
      }

      const startDate = dayjs().toISOString();
      const subscription: Subscription = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        icon: icons.plus,
        name: input.name.trim(),
        plan: input.plan?.trim() || undefined,
        category: input.category?.trim() || undefined,
        paymentMethod: "Not set",
        status: "active",
        startDate,
        price: input.price,
        currency: "RM",
        billing: input.billing,
        renewalDate: dayjs(startDate)
          .add(1, input.billing === "Yearly" ? "year" : "month")
          .toISOString(),
        color: "#f6eecf",
      };
      const updatedSubscriptions = [subscription, ...customSubscriptions];
      const persistedSubscriptions: PersistedSubscription[] =
        updatedSubscriptions.map(({ icon: _icon, ...entry }) => entry);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(persistedSubscriptions),
      );
      setCustomSubscriptions(updatedSubscriptions);
      posthog?.capture("subscription_created", {
        subscription_category: subscription.category ?? "Other",
        subscription_frequency: subscription.billing,
        subscription_name: subscription.name,
        subscription_price: subscription.price,
      });

      return subscription;
    },
    [customSubscriptions, isLoaded, loadError],
  );

  const subscriptions = useMemo(
    () => [...customSubscriptions, ...HOME_SUBSCRIPTIONS],
    [customSubscriptions],
  );

  return (
    <SubscriptionsContext.Provider
      value={{ subscriptions, isLoaded, loadError, addSubscription }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);

  if (!context) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionsProvider.",
    );
  }

  return context;
}
