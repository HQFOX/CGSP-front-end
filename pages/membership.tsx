import { useState } from 'react';

import type { NextPage } from 'next';
import Link from 'next/link';

import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import { StyledButton } from '../components';
import { EnrollmentModal } from '../components/modals/enrollmentModal/enrollmentModal';

const statutesPdfPath = '/Estatutos - Cooperativa Giraldo Sem Pavor - 01-10-2020.pdf';

const Membership: NextPage = () => {
    const { t } = useTranslation(['membership']);

    const [showEnrollmentModal, setShowEnrollmentModal] = useState<boolean>(false);

    return (
        <PageContainer>
            <Box sx={{ p: 2, pb: 6 }}>
                <Title variant="h5" component="h1" fontSize={24}>
                    {t('title')}
                </Title>
                <Divider />
                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        background:
                            'linear-gradient(120deg, rgba(245,247,250,0.95) 0%, rgba(255,255,255,1) 100%)'
                    }}
                >
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {t('intro')}
                    </Typography>

                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {t('financialDetailsTitle')}
                            </Typography>
                            <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 1 }}>
                                <Typography component="li" variant="body2" color="text.secondary">
                                    {t('monthlyFee')}
                                </Typography>
                                <Typography component="li" variant="body2" color="text.secondary">
                                    {t('membershipFee')}
                                </Typography>
                                <Typography component="li" variant="body2" color="text.secondary">
                                    {t('shareCapital')}
                                </Typography>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {t('howToJoinTitle')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('howToJoinText')}
                            </Typography>
                        
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {t('contactText')}
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <StyledButton
                                    variant="contained"
                                    onClick={() => setShowEnrollmentModal(true)}
                                >
                                    {t('askToBeContacted')}
                                </StyledButton>
                                <StyledButton component={Link} href="/projects" variant="outlined">
                                    {t('showProjectInterest')}
                                </StyledButton>
                                <EnrollmentModal
                                    open={showEnrollmentModal}
                                    handleEnrollmentModalClose={() => setShowEnrollmentModal(false)}
                                                                    
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {t('documentsTitle')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {t('documentsText')}
                            </Typography>
                            <Button
                                component="a"
                                href={statutesPdfPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="text"
                                sx={{ px: 0 }}
                            >
                                {t('statutesLinkLabel')}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </PageContainer>
    );
};
export const getServerSideProps = async (ctx: any) => {
    return {
        props: {
            ...(await serverSideTranslations(ctx.locale, [
                'common',
                'footer',
                'header',
                'membership',
                'projectpage'
            ]))
        }
    };
};

export default Membership;
