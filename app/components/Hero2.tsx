"use client";
import React from "react";

const Hero2 = () => {
    // Array of images, text, and prices for the cards
    const cards = [
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-EverydaySeamlessWashedLeggingsGSSetsRedWASHB6B8X_RCCJ_1094_V2_640x.jpg?v=1769450567",
            text: "Everyday Seamless Washed Legging 2.0",
            price: 45.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-EverydaySeamlessWashedSportsBraGSSetsRedWASHB6B8Y_RCCJ_0179_V2_640x.jpg?v=1769450572",
            text: "Everyday Seamless Washed Sports Bra",
            price: 29.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-EverydaySeamlessWashedCroppedTankGSSetsRedWASHB6B8Z_RCCJ_1119_V2_640x.jpg?v=1769450569",
            text: "Everyday Seamless Cropped Tank",
            price: 34.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-EverydaySeamlessWashedShortsGSSetsRedWASHB6B8W_RCCJ_0075_V3_640x.jpg?v=1769074819",
            text: "Everyday Seamless Washed Shorts",
            price: 39.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-25418579_640x.jpg?v=1769618580",
            text: "Everyday Seamless Top",
            price: 49.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-25418185_640x.jpg?v=1769592366",
            text: "Everyday Seamless Legging",
            price: 59.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-LiftSeamlessShortsGSCarmineRedB6A8I_RBQW_0330_V3_640x.jpg?v=1769610265",
            text: "Lift Seamless Shorts",
            price: 44.99,
        },
        {
            src: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-25418536_640x.jpg?v=1769592306",
            text: "Lift Seamless Tank",
            price: 39.99,
        },
    ];

    return (
        <div className="bg-white text-black p-10 flex flex-col">
            {/* Section Title */}
            <div className="text-2xl font-bold mb-4">Womens</div>
            <div className="text-xl font-semibold mb-6">NEW IN RED</div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar">
                {cards.map((card, index) => (
                    <div key={index} className="flex-none w-64 h-full">
                        <img
                            src={card.src}
                            alt={`Card ${index + 1}`}
                            className="w-full h-2/3 object-cover mb-4 "
                        />
                        <div className="text-lg font-bold mb-1">{`$${card.price.toFixed(2)}`}</div>
                        <p className="text-sm">{card.text}</p>
                    </div>
                ))}
            </div>
            <section className="flex flex-row justify-around p-5 py-[6rem]">
                <div>
                    <h1 className="font-bold text-xl">Women&apos;s Leggings</h1>
                    <div className="py-4 list-none space-y-2">
                        <li>Gym Leggings</li>
                        <li>Leggings With Pockets</li>
                        <li>High Waisted Leggings</li>
                        <li>Scrunch Bum Leggings</li>
                        <li>Black Leggings</li>
                        <li>Flare Leggings</li>
                        <li>Seamless Leggings</li>
                        <li>Petite Gym Leggings</li>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-xl">Women&apos;s Gymwear</h1>
                    <div className="py-4 list-none space-y-2">
                        <li>Women&apos;s Gym Wear</li>
                        <li>Womens Gym Shorts</li>
                        <li>Running Shorts</li>
                        <li>Sports Bras</li>
                        <li>High Impact Sports Bras</li>
                        <li>Black Sports Bras</li>
                        <li>Matching Sets</li>
                        <li>Loungewear</li>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-xl">Men&apos;s Gymwear</h1>
                    <div className="py-4 list-none space-y-2">
                        <li>Men&apos;s Gymwear</li>
                        <li>Mens Gym Shorts</li>
                        <li>Shorts with Pockets</li>
                        <li>Men&apos;s Running Shorts</li>
                        <li>Gym Shirts</li>
                        <li>Sleeveless T-Shirts</li>
                        <li>Gym Stringers</li>
                        <li>Men&apos;s Baselayers</li>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-xl">Accessories</h1>
                    <div className="py-4 list-none space-y-2">
                        <li>Women&apos;s Underwear</li>
                        <li>Men&apos;s Underwear</li>
                        <li>Workout Bags</li>
                        <li>Duffel Bags</li>
                        <li>Gym Socks</li>
                        <li>Crew Socks</li>
                        <li>Caps</li>
                        <li>Beanies</li>
                    </div>
                </div>
            </section>
            <hr className="border-t border-gray-300 mt-2 mb-8" />
            <div className="p-10 flex flex-col md:flex-row justify-between gap-10">
                {/* Left Column */}
                <div className="flex flex-col md:flex-row gap-16">
                    <div>
                        <h2 className="font-bold mb-2">Help</h2>
                        <ul className="list-none space-y-1">
                            <li>FAQ</li>
                            <li>Delivery Information</li>
                            <li>Return Policy</li>
                            <li>Make A Return</li>
                            <li>Orders</li>
                            <li>Submit a Fake</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2">My Account</h2>
                        <ul className="list-none space-y-1">
                            <li>Login</li>
                            <li>Register</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2">Pages</h2>
                        <ul className="list-none space-y-1">
                            <li>Stores</li>
                            <li>Refer a Friend</li>
                            <li>RagePeak Central</li>
                            <li>RagePeak Loyalty</li>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Student Discount</li>
                            <li>Training App</li>
                            <li>Military Discount</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                    <h2 className="font-bold mb-4">More About RagePeak</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Card 1 */}
                        <div className="flex flex-col items-center bg-white p-4 rounded shadow">
                            <img
                                src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F4QtcnsrjM61MBOfKzadnle%2F71b2f410cc0b750b70fd93a1866e1b5c%2Fblog-footer.jpg&w=1920&q=80"
                                alt="Blog"
                                className="w-36 h-24 object-cover rounded mb-2"
                            />
                            <span className="text-center font-semibold">Blog</span>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col items-center bg-white p-4 rounded shadow">
                            <img
                                src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F3PKQBuoomlHFd10tV2xhCY%2F2de6be180d73c666374009c7a1065be4%2F1_Students.jpg&w=1920&q=80"
                                alt="Student Discount"
                                className="w-36 h-24 object-cover rounded mb-2"
                            />
                            <span className="text-center font-semibold">
                                15% Student Discount
                            </span>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col items-center bg-white p-4 rounded shadow">
                            <img
                                src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F78i6cwhCg8cVO59Dvlk7Gy%2F0f941cc6bb840d0556fca0913b884674%2FNewsletter.jpg&w=1920&q=80"
                                alt="Email Sign Up"
                                className="w-36 h-24 object-cover rounded mb-2"
                            />
                            <span className="text-center font-semibold">Email Sign Up</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-t border-gray-300 mt-2 mb-8" />
            <div className="flex justify-around gap-4">
                <div>© 2026 | RagePeak Limited | All Rights Reserved. | We Do Gym.</div>
                <div className="gap-4 flex">
                    <div>Terms & Conditions</div>
                    <div>Terms of Use</div>
                    <div>Privacy Notice</div>
                    <div>Cookie Policy</div>
                    <div>Modern Slavery</div>
                </div>
            </div>
        </div>
    );
};

export default Hero2;
