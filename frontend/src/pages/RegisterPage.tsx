import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm";

const RegisterPage = () => {
  return (
    <div className="h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      {/* background glow */}
      <div className="absolute pointer-events-none w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full top-[-150px]" />

      <div className="relative w-full max-w-md md:max-w-lg z-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            ConnectHub
          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            A Place To Flex Your Creation
          </p>
        </div>

        <RegisterUserForm />
      </div>
    </div>
  );
};

export default RegisterPage;
