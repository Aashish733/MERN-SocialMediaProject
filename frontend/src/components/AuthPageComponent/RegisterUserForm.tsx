import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../../schemas/auth.schema";
import type { RegisterUserFormData } from "../../schemas/auth.schema";
import { useState } from "react";
import { registerUser } from "../../api/auth.api";
import Spinner from "../General/Spinner";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const RegisterUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    try {
      setLoading(true);
      const response = await registerUser(data);
      dispatch(setUser(response.data.user));
      toast.success("Account Created Successfully");
      reset();
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">Create Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Username</label>
            <Input
              type="text"
              {...register("username")}
              placeholder="Create your username"
              className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.username?.message}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Email</label>
            <Input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.email?.message}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Password</label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Create your password"
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.password?.message}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Profile Picture</label>
            <Input
              type="file"
              {...register("profileImage")}
              accept="image/*"
              className={`file:text-primary file:bg-primary/10 file:hover:bg-primary/20 file:mr-4 file:px-4 file:py-1 file:rounded-md file:border-0 cursor-pointer text-muted-foreground ${errors.profileImage ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.profileImage?.message}</p>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              Already have an account?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? <Spinner /> : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default RegisterUserForm;
