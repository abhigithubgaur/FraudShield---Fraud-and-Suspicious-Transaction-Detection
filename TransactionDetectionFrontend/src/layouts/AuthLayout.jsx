const AuthLayout = ({
  children,
}) => {
  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        flex
      "
    >
      {/* Left Side */}

      <div
        className="
          hidden
          lg:flex
          lg:w-1/2
          bg-linear-to-br
          from-indigo-600
          via-indigo-700
          to-purple-800
          text-white
          p-16
          flex-col
          justify-between
        "
      >
        <div>
          <h1 className="text-5xl font-bold">
            FraudShield
          </h1>

          <p className="mt-4 text-xl text-indigo-100">
            Intelligent Fraud Detection
            for Secure Banking
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Protect every transaction
            with real-time fraud
            monitoring.
          </h2>

          <p className="mt-6 text-indigo-100 text-lg">
            Advanced risk scoring,
            suspicious activity
            detection, OTP verification,
            and account protection —
            all in one platform.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10">

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h3 className="text-3xl font-bold">
                99.9%
              </h3>

              <p className="text-indigo-100">
                Detection Accuracy
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h3 className="text-3xl font-bold">
                24/7
              </h3>

              <p className="text-indigo-100">
                Monitoring
              </p>
            </div>

          </div>
        </div>

        <p className="text-indigo-200 text-sm">
          © 2026 FraudShield Platform
        </p>
      </div>

      {/* Right Side */}

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;