"use client";
import SignIn from "@/components/common/login-signup-modal/SignIn";
import { useAuth } from "@/hooks/useAuth";
import { validateToken } from "@/utils/authUtils";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Login = () => {
  const { isAuthenticated, auth, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInvalidToken, setHasInvalidToken] = useState(false);

  useEffect(() => {
    if (isAuthenticated && auth.accessToken) {
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/dashboard/my-profile";
      router.replace(redirectUrl);
      return;
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken || refreshToken) {
          const accessTokenValid = accessToken ? validateToken(accessToken).isValid : false;
          const refreshTokenValid = refreshToken ? validateToken(refreshToken).isValid : false;
          if ((accessToken && !accessTokenValid) || (refreshToken && !refreshTokenValid)) {
            setHasInvalidToken(true);
          }
        }
      }

      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, auth.accessToken, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login || ZeroBroker - Real Estate NextJS Template</title>
      </Head>
      {/* Our Compare Area */}
      <section className="our-compare pt0 pb0">
        <Image
          width={1012}
          height={519}
          src="/images/icon/login-page-icon.svg"
          alt="logo"
          className="login-bg-icon contain"
          data-aos="fade-right"
          data-aos-delay="300"
        />
        <div className="container">
          <div className="row" data-aos="fade-left" data-aos-delay="300">
            <div className="col-lg-6">
              <div className="log-reg-form signup-modal form-style1 bgc-white p30 p30-sm default-box-shadow2 bdrs12">
                <div className="text-center mb30">
                  <Link href="/">
                    <Image
                      width={138}
                      height={44}
                      className="mb15"
                      src="/images/logoBlack.png"
                      alt="logo"
                    />
                  </Link>
                  <h2>Sign in</h2>
                </div>
                <SignIn />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;