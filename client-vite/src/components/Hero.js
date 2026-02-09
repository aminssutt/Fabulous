import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  height:100vh; position:relative; display:flex; align-items:center; margin-top:-60px; overflow:hidden;
  &::before{content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000') center/cover; filter:brightness(.4); z-index:-1; transform:scale(1.1); transition:${p=>p.theme.transitions.slow};}
  &:hover::before{ transform:scale(1.15); }
  @media (max-width:${p=>p.theme.breakpoints.tablet}){ height:calc(100vh - 60px); margin-top:0; padding-top:60px; }
`;
const HeroContent = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;text-align:center;color:${p=>p.theme.colors.text};`;
const Title = styled.h1`font-size:4.5rem;margin:0 0 1.5rem;letter-spacing:2px;text-transform:uppercase;text-shadow:${p=>p.theme.shadows.text}; span{color:${p=>p.theme.colors.primary}; position:relative; display:inline-block;}
  @media (max-width:${p=>p.theme.breakpoints.tablet}){font-size:3.5rem;}
  @media (max-width:${p=>p.theme.breakpoints.mobile}){font-size:2.2rem;}
`;
const Subtitle = styled.p`font-size:1.5rem;max-width:800px;margin:0 auto 2.5rem;line-height:1.8;opacity:.9;text-shadow:${p=>p.theme.shadows.text};
  @media (max-width:${p=>p.theme.breakpoints.tablet}){font-size:1.3rem;}
  @media (max-width:${p=>p.theme.breakpoints.mobile}){font-size:1.1rem;}
`;
const ScrollIndicator = styled.div`position:absolute;left:50%;bottom:2rem;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;color:${p=>p.theme.colors.text};opacity:.8;animation:bounce 2s infinite; text-shadow:${p=>p.theme.shadows.text};
  span{letter-spacing:2px;text-transform:uppercase;font-size:1rem;}
  @keyframes bounce{0%,20%,50%,80%,100%{transform:translate(-50%,0);}40%{transform:translate(-50%,-10px);}60%{transform:translate(-50%,-5px);}}
`;

export default function Hero(){
  return (
    <HeroSection id="home">
      <HeroContent>
        <Title>CRÉEZ VOTRE ESPACE DE <span>RÊVE</span></Title>
        <Subtitle>Transformez votre intérieur en un chef-d'œuvre unique qui reflète votre personnalité et votre style de vie avec notre expertise en design d'intérieur.</Subtitle>
      </HeroContent>
      <ScrollIndicator><span>Découvrir</span><span>↓</span></ScrollIndicator>
    </HeroSection>
  );
}
