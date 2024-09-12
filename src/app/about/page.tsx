/**
 * @file /app/about/page.tsx
 * @fileoverview the About page containing a video from the Cal Poly Humboldt Youtube video,
 * a non-flora model, and paragraphical information about the project.
 */

import Header from '@/components/Header/Header';
import Foot from '@/components/Shared/Foot';

const About = async () => {

  return (
    <>
      <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1'></meta>
      <title>3D Herbarium - About Page</title>

      <Header pageRoute='inaturalist' headerTitle='About' />
      <main className='min-h-[calc(100vh-177px)] flex items-center justify-center '>
        <p className='text-3xl'>3DVertebrates About Page Content</p>
      </main>
      <Foot />
    </>
  );

};

export default About;