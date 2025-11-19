import React from 'react'
import type { Route } from "../marketplace/+types/index";
import Navbar from '~/components/navbar';

export const IndexPage = () => {
  return (
    <main>
      <section>
        <div>
          <h1 className="text-2xl"> Marketplace Home Page </h1>
        </div>
      </section>
    </main>
  )
}

export default IndexPage;